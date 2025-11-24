export function formatFecha(fechaIso: string | Date | null | undefined): string {
  if (!fechaIso) return '';
  let date; 
  if(typeof fechaIso  == 'string'){
     date = new Date(fechaIso);
  }else {
    date = fechaIso;
  }
  
  if (Number.isNaN(date.getTime())) return fechaIso.toString();
  return date.toLocaleString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}