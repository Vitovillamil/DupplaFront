import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
	ReactiveFormsModule,
	FormBuilder,
	Validators,
	FormControl,
	FormGroup
} from '@angular/forms';

import { DocumentService }	from '../../../../core/services/document.service';
import { DocumentEstado }	from '../../../../core/models/document.model';

type DocumentForm = FormGroup<{
	tipo: FormControl<string>;
	monto: FormControl<number>;
	estado: FormControl<DocumentEstado>;
}>;

@Component({
	selector: 'app-document-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './document-form.component.html'
})
export class DocumentFormComponent implements OnInit {

	form!: DocumentForm;

	documentId?: number;
	isEdit = false;

	estados				= ['borrador']
	estadosBorrador		= ['pendiente'];
	estadosPendiente	= ['aprobado', 'rechazado'];

	constructor(
		private fb: FormBuilder,
		private service: DocumentService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		this.form = this.fb.nonNullable.group({
			tipo:	['', Validators.required],
			monto:	[0, [Validators.required, Validators.min(1)]],
			estado:	['borrador' as DocumentEstado, Validators.required]
		});

		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.documentId = +id;
			this.isEdit = true;
			this.load();
		}
	}

	load() {
		this.service.get(this.documentId!)
			.subscribe(doc => {
				if (doc.estado == 'borrador') {this.estados			= this.estadosBorrador}
				else if (doc.estado == 'pendiente') {this.estados	= this.estadosPendiente}

				this.form.patchValue({
					tipo: doc.tipo,
					monto: doc.monto,
					estado: doc.estado
				});
			});
	}

	submit() {
		if (this.form.invalid) return;

		const action = this.isEdit
			? this.service.update(this.documentId!, this.form.getRawValue())
			: this.service.create(this.form.getRawValue());

		action.subscribe(() => {
			this.router.navigate(['/documentos']);
		});
	}

	cancel() {
		this.router.navigate(['/documentos']);
	}
}
