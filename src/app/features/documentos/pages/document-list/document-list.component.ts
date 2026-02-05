import { Component, OnInit, ChangeDetectorRef }						from '@angular/core';
import { CommonModule }												from '@angular/common';
import { RouterModule }												from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup}	from '@angular/forms';

import { interval, switchMap, takeWhile, Subject }	from 'rxjs';
import { finalize, takeUntil }						from 'rxjs/operators';

import { NgbPaginationModule, NgbAlertModule, NgbDatepickerModule, NgbTooltipModule  } from '@ng-bootstrap/ng-bootstrap';

import { DocumentService }			from '../../../../core/services/document.service';
import { Document, DocumentEstado }	from '../../../../core/models/document.model';

import { JobService }	from '../../../../core/services/job.service';
import { Job }			from '../../../../core/models/job.model';

type DocumentForm = FormGroup<{
	tipo: FormControl<string>;
	estado: FormControl<DocumentEstado | ''>;
	monto_min: FormControl<number>;
	monto_max: FormControl<number>;
	fecha_desde: FormControl<string | null>;
	fecha_hasta: FormControl<string | null>;
}>;

@Component({
	selector: 'app-document-list',
	standalone: true,
	imports: [CommonModule, RouterModule, NgbPaginationModule, ReactiveFormsModule, NgbAlertModule, NgbDatepickerModule, NgbTooltipModule],
	templateUrl: './document-list.component.html'
})
export class DocumentListComponent implements OnInit {
	filterForm!:DocumentForm;
	selected = new Set<number>();

	job: Job | null = null;

	loading:boolean		= false;
	processing:boolean	= false;

	constructor(
		private serviceDocument: DocumentService,
		private serviceJob: JobService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {}

	private destroy$ = new Subject<void>();

	documents: Document[] = [];
	page = 1;
	size = 10;
	total = 0;

	ngOnInit() {
		this.filterForm = this.fb.group({
			tipo: [''],
			estado: ['' as DocumentEstado | ''],
			monto_min: [0],
			monto_max: [0],
			fecha_desde: [null],
			fecha_hasta: [null]
		}) as DocumentForm;


		this.load();
	}

	load() {
		const rawFilters = this.filterForm.value;

		const filters: any = {
			page: this.page,
			size: this.size
		};

		Object.entries(rawFilters).forEach(([key, value]) => {
			if (value !== null && value !== '' && value !== 0) {
				const parsedValue = this.toDateString(value);

				if (parsedValue !== null) {
					filters[key] = parsedValue;
				}
			}
		});

		this.loading = true;

		console.log(filters)
		this.serviceDocument
			.list(filters)
			.pipe(
				finalize(() => {
					this.loading = false;
					this.cdr.detectChanges();
				})
			)
			.subscribe(res => {
				this.documents = [...res.items];
				this.total = res.total;
			});
	}

	private toDateString(value: any): string | null {
		if (!value) return null;

		if (value.year && value.month && value.day) {
			const mm = String(value.month).padStart(2, '0');
			const dd = String(value.day).padStart(2, '0');

			return `${value.year}-${mm}-${dd}`;
		}

		return value;
	}


	applyFilters() {
		this.page = 1;
		this.load();
	}

	toggle(id: number) {
		this.selected.has(id)
			? this.selected.delete(id)
			: this.selected.add(id);
	}

	toggleAll(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this.selected.clear();

		if (checked) {
			this.documents
				.filter(d => d.id !== undefined)
				.forEach(d => this.selected.add(d.id!));
		}
	}


	processBatch() {
		this.processing = true;

		this.serviceDocument
			.processBatch([...this.selected])
			.pipe(
				finalize(() => {
					this.processing = false;
					this.cdr.detectChanges();
				})
			)
			.subscribe(res => {
				this.job = {
					id: res.job_id,
					status: 'pendiente',
					total: this.selected.size,
					processed: 0
				} as Job;

				console.log(this.job)
				this.startPolling(res.job_id);
				this.selected.clear();
			});
	}

	startPolling(jobId: number) {
		interval(1000)
			.pipe(
				takeUntil(this.destroy$),
				switchMap(() => this.serviceJob.get(jobId)),
				takeWhile(job => job.status !== 'completado', true),
				finalize(() => {
					this.cdr.detectChanges();
				})
			)
			.subscribe(job => {
				this.job = job;
				console.log(this.job)

				if (job.status === 'completado') {
					this.load();
				}

				this.cdr.detectChanges();
			});
	}

	statusClass(status: string) {
		return {
			'bg-secondary':status === 'borrador',
			'bg-warning text-dark':status === 'pendiente',
			'bg-success':status === 'aprobado',
			'bg-danger':status === 'rechazado'
		};
	}

	alertClass(alert: string) {
		return {
			'alert-info':alert === 'procesando',
			'alert-warning':alert === 'pendiente',
			'alert-success':alert === 'completado',
			'alert-danger':alert === 'fallido'
		};
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
