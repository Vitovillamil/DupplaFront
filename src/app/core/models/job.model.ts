export interface Job {
	id: number;
	status: 'pendiente' | 'procesando' | 'completado' | 'fallido';
	total: number;
	processed: number;
	progress: number;
}
