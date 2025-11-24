import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { deleteExpediente, getExpedientes } from '../services/expedientesService';
import type { Expediente, ExpedienteEstado } from '../types/expediente';
import { formatFecha } from '../utils/formater';
import { ExpedienteEstadoChip } from '../components/ExpedienteEstadoChip';
import { useSession } from '../SessionContext';


type EstadoFiltro = 'TODOS' | ExpedienteEstado;

const ESTADO_LABEL: Record<string, string> = {
  BORRADOR: 'Borrador',
  EN_REVISION: 'En revisión',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
};



export default function ExpedientesPage() {
  const [expedientes, setExpedientes] = React.useState<Expediente[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = React.useState<EstadoFiltro>('TODOS');

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [expedienteToDelete, setExpedienteToDelete] = React.useState<Expediente | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const navigate = useNavigate();
  const { session } = useSession();
  const roles = (session?.user as any)?.roles ?? [];
  const esTecnico = roles.includes('TECNICO');
  const esCoordinador = roles.includes('COORDINADOR');


  const cargarExpedientes = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpedientes(estadoFiltro === 'TODOS' ? undefined : estadoFiltro);
      setExpedientes(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  }, [estadoFiltro]);

  React.useEffect(() => {
    void cargarExpedientes();
  }, [cargarExpedientes]);

  const handleEstadoChange = (event: React.ChangeEvent<{ value: unknown }> | any) => {
    setEstadoFiltro(event.target.value as EstadoFiltro);
  };

  const handleRowClick = (expedienteId: string) => {
    navigate(`/expedientes/${expedienteId}`);
  };

  const handleNuevoExpediente = () => {
    navigate('/expedientes/nuevo');
  };

    const abrirDialogEliminar = (exp: Expediente, e: React.MouseEvent) => {
    e.stopPropagation(); // para que no dispare el onClick de la fila
    setExpedienteToDelete(exp);
    setDeleteDialogOpen(true);
  };

  const cerrarDialogEliminar = () => {
    setDeleteDialogOpen(false);
    setExpedienteToDelete(null);
  };

  const confirmarEliminar = async () => {
    if (!expedienteToDelete) return;
    try {
      setDeleting(true);
      setError(null);
      await deleteExpediente(expedienteToDelete.id);
      setExpedientes((prev) =>
        prev.filter((e) => e.id !== expedienteToDelete.id),
      );
      cerrarDialogEliminar();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al eliminar el expediente',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>

        {/* De momento, botón visible solo para técnicos */}
        {esTecnico && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevoExpediente}
          >
            Nuevo expediente
          </Button>
        )}
      </Stack>

      <Paper sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="estado-filtro-label">Estado</InputLabel>
            <Select
              labelId="estado-filtro-label"
              id="estado-filtro"
              value={estadoFiltro}
              label="Estado"
              onChange={handleEstadoChange}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="BORRADOR">Borrador</MenuItem>
              <MenuItem value="EN_REVISION">En revisión</MenuItem>
              <MenuItem value="APROBADO">Aprobado</MenuItem>
              <MenuItem value="RECHAZADO">Rechazado</MenuItem>
            </Select>
          </FormControl>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="body2">Cargando...</Typography>
            </Stack>
          )}
        </Toolbar>
      </Paper>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Técnico</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell>Última revisión</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expedientes.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay expedientes para los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              expedientes.map((exp) => (
                <TableRow
                  key={exp.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(exp.id)}
                >
                  <TableCell>{exp.codigoExpediente}</TableCell>
                  <TableCell>{exp.descripcion}</TableCell>
                  <TableCell>
                    <ExpedienteEstadoChip estado={exp.estado} />
                  </TableCell>
                  <TableCell>{exp.usuarioCreacion?.nombre}</TableCell>
                  <TableCell>{formatFecha(exp.fechaCreacion)}</TableCell>
                  <TableCell>{formatFecha(exp.revision?.fecha || null)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={() => handleRowClick(exp.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {esTecnico && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => abrirDialogEliminar(exp, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

       <Dialog open={deleteDialogOpen} onClose={cerrarDialogEliminar}>
        <DialogTitle>Eliminar expediente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar el expediente{' '}
            <strong>{expedienteToDelete?.codigoExpediente}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogEliminar}>Cancelar</Button>
          <Button
            onClick={confirmarEliminar}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}