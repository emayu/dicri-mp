import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    TextField,
    Chip,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    DialogContentText,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Send as SendIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import { useSession } from '../SessionContext';
import type { Expediente } from '../types/expediente';
import type { Indicio, IndicioInput } from '../types/indicio';

import {
    getExpedienteById,
    updateExpediente,
    enviarExpedienteARevision,
    aprobarExpediente,
    rechazarExpediente,
} from '../services/expedientesService';

import {
    getIndiciosByExpediente,
    createIndicio,
    updateIndicio,
    deleteIndicio,
} from '../services/indiciosService';
import { formatFecha } from '../utils/formater';
import { ExpedienteEstadoChip } from '../components/ExpedienteEstadoChip';


function estadoLabel(estado: string): string {
    switch (estado) {
        case 'BORRADOR':
            return 'Borrador';
        case 'EN_REVISION':
            return 'En revisión';
        case 'APROBADO':
            return 'Aprobado';
        case 'RECHAZADO':
            return 'Rechazado';
        default:
            return estado;
    }
}


export default function ExpedienteDetallePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { session } = useSession();

    const [expediente, setExpediente] = React.useState<Expediente | null>(null);
    const [descripcion, setDescripcion] = React.useState<string>('');
    const [indicios, setIndicios] = React.useState<Indicio[]>([]);

    const [loading, setLoading] = React.useState<boolean>(true);
    const [saving, setSaving] = React.useState<boolean>(false);
    const [actionLoading, setActionLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    // Dialogo de indicio (crear/editar)
    const [indicioDialogOpen, setIndicioDialogOpen] = React.useState<boolean>(false);
    const [indicioEditing, setIndicioEditing] = React.useState<Indicio | null>(null);
    const [indicioForm, setIndicioForm] = React.useState<IndicioInput>({
        descripcion: '',
        color: '',
        tamanio: '',
        peso: '',
        ubicacion: '',
    });

    // Dialogo de rechazo
    const [rechazoDialogOpen, setRechazoDialogOpen] = React.useState<boolean>(false);
    const [rechazoJustificacion, setRechazoJustificacion] = React.useState<string>('');
    const [rechazoTipo, setRechazoTipo] = React.useState<string>('');

    // Dialogo de eliminación de indicio
    const [deleteIndicioDialogOpen, setDeleteIndicioDialogOpen] = React.useState(false);
    const [indicioToDelete, setIndicioToDelete] = React.useState<Indicio | null>(null);

    // Dialogo de confirmación de aprobar
    const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);

    const userRoles = (session?.user.roles) ?? [];
    const canEditExpediente =
        expediente?.estado === 'BORRADOR' && userRoles.includes('TECNICO');

    const canEnviarRevision =
        expediente?.estado === 'BORRADOR' && userRoles.includes('TECNICO')

    const canAprobarORechazar =
        expediente?.estado === 'EN_REVISION' && userRoles.includes('COORDINADOR');

    const canEditIndicios = expediente?.estado === 'BORRADOR' && userRoles.includes('TECNICO')

    const cargarDatos = React.useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const [exp, inds] = await Promise.all([
                getExpedienteById(id),
                getIndiciosByExpediente(id),
            ]);
            setExpediente(exp);
            setDescripcion(exp.descripcion ?? '');
            setIndicios(inds);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al cargar expediente');
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        void cargarDatos();
    }, [cargarDatos]);

    const handleGuardarExpediente = async () => {
        if (!id || !expediente) return;
        try {
            setSaving(true);
            setError(null);
            const updated = await updateExpediente(id, { descripcion });
            setExpediente(updated);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al guardar expediente');
        } finally {
            setSaving(false);
        }
    };

    const handleEnviarRevision = async () => {
        if (!id) return;
        try {
            setActionLoading(true);
            setError(null);
            const updated = await enviarExpedienteARevision(id);
            setExpediente(updated);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al enviar a revisión');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAprobar = async () => {
        if (!id) return;
        try {
            setActionLoading(true);
            setError(null);
            const updated = await aprobarExpediente(id);
            setExpediente(updated);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al aprobar expediente');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAbrirRechazo = () => {
        setRechazoJustificacion('');
        setRechazoTipo('');
        setRechazoDialogOpen(true);
    };

    const handleConfirmarRechazo = async () => {
        if (!id) return;
        try {
            setActionLoading(true);
            setError(null);
            const updated = await rechazarExpediente(id, {
                justificacion: rechazoJustificacion,
                tipoRechazo: rechazoTipo || null,
            });
            setExpediente(updated);
            setRechazoDialogOpen(false);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al rechazar expediente');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAbrirDialogCrearIndicio = () => {
        setIndicioEditing(null);
        setIndicioForm({
            descripcion: '',
            color: '',
            tamanio: '',
            peso: '',
            ubicacion: '',
        });
        setIndicioDialogOpen(true);
    };

    const handleAbrirDialogEditarIndicio = (indicio: Indicio) => {
        setIndicioEditing(indicio);
        setIndicioForm({
            descripcion: indicio.descripcion,
            color: indicio.color ?? '',
            tamanio: indicio.tamanio ?? '',
            peso: indicio.peso ?? '',
            ubicacion: indicio.ubicacion ?? '',
        });
        setIndicioDialogOpen(true);
    };

    const handleGuardarIndicio = async () => {
        if (!id) return;
        try {
            setActionLoading(true);
            setError(null);
            let result: Indicio;
            const payload: IndicioInput = {
                descripcion: indicioForm.descripcion,
                color: indicioForm.color,
                tamanio: indicioForm.tamanio,
                peso: indicioForm.peso,
                ubicacion: indicioForm.ubicacion,
            };

            if (indicioEditing) {
                result = await updateIndicio(id, indicioEditing.id, payload);
                setIndicios((prev) => prev.map((i) => (i.id === result.id ? result : i)));
            } else {
                result = await createIndicio(id, payload);
                setIndicios((prev) => [...prev, result]);
            }

            setIndicioDialogOpen(false);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al guardar indicio');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEliminarIndicio = async () => {
        if (!id || !indicioToDelete) return;
        try {
            setActionLoading(true);
            setError(null);

            await deleteIndicio(id, indicioToDelete.id);

            setIndicios((prev) => prev.filter((i) => i.id !== indicioToDelete.id));
            setDeleteIndicioDialogOpen(false);
            setIndicioToDelete(null);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error ? err.message : 'Error al eliminar indicio',
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!expediente) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">No se encontró el expediente.</Alert>
                <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/expedientes')}>
                    Volver al listado
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h5">Expediente {expediente.codigoExpediente}</Typography>
                <ExpedienteEstadoChip estado={expediente.estado} size='medium' />
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 2 }}>
                <Stack direction="column" spacing={2}>
                    <TextField
                        label="Descripción del expediente"
                        value={descripcion}
                        fullWidth
                        multiline
                        minRows={2}
                        onChange={(e) => setDescripcion(e.target.value)}
                        disabled={!canEditExpediente || saving}
                    />

                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Técnico"
                            value={expediente.usuarioCreacion?.nombre ?? ''}

                        />
                        <TextField
                            label="Fecha creación"
                            value={formatFecha(expediente.fechaCreacion)}
                            InputProps={{ readOnly: true }}
                        />
                    </Stack>

                    {expediente.revision && (
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Última revisión"
                                value={formatFecha(expediente.revision.fecha ?? null)}
                                InputProps={{ readOnly: true }}
                            />
                            <TextField
                                label="Coordinador"
                                value={expediente.revision.usuario?.nombre ?? ''}
                                InputProps={{ readOnly: true }}
                            />
                        </Stack>
                    )}

                    {expediente.revision?.justificacionRechazo && (
                        <TextField
                            label="Justificación de rechazo"
                            value={expediente.revision.justificacionRechazo}
                            InputProps={{ readOnly: true }}
                            multiline
                            minRows={2}
                        />
                    )}

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => navigate('/expedientes')}>
                            Volver
                        </Button>

                        {canEditExpediente && (
                            <Button
                                variant="contained"
                                onClick={handleGuardarExpediente}
                                disabled={saving}
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </Button>
                        )}

                        {canEnviarRevision && (
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<SendIcon />}
                                onClick={handleEnviarRevision}
                                disabled={actionLoading}
                            >
                                Enviar a revisión
                            </Button>
                        )}

                        {canAprobarORechazar && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckIcon />}
                                    onClick={handleAprobar}
                                    disabled={actionLoading}
                                >
                                    Aprobar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CloseIcon />}
                                    onClick={handleAbrirRechazo}
                                    disabled={actionLoading}
                                >
                                    Rechazar
                                </Button>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* Indicios */}
            <Paper sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Indicios</Typography>
                    {canEditIndicios && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAbrirDialogCrearIndicio}
                            disabled={actionLoading}
                        >
                            Agregar indicio
                        </Button>
                    )}
                </Stack>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Tamaño</TableCell>
                            <TableCell>Peso</TableCell>
                            <TableCell>Ubicación</TableCell>
                            <TableCell>Fecha creación</TableCell>
                            <TableCell>Técnico</TableCell>
                            {canEditIndicios && <TableCell align="right">Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {indicios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={canEditIndicios ? 8 : 7} align="center">
                                    No hay indicios registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            indicios.map((ind) => (
                                <TableRow key={ind.id}>
                                    <TableCell>{ind.descripcion}</TableCell>
                                    <TableCell>{ind.color}</TableCell>
                                    <TableCell>{ind.tamanio}</TableCell>
                                    <TableCell>{ind.peso}</TableCell>
                                    <TableCell>{ind.ubicacion}</TableCell>
                                    <TableCell>{formatFecha(ind.fechaCreacion)}</TableCell>
                                    <TableCell>{ind.usuarioCreacion?.nombre}</TableCell>
                                    {canEditIndicios && (
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleAbrirDialogEditarIndicio(ind)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setIndicioToDelete(ind);
                                                    setDeleteIndicioDialogOpen(true);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Dialogo de crear/editar indicio */}
            <Dialog open={indicioDialogOpen} onClose={() => setIndicioDialogOpen(false)} fullWidth>
                <DialogTitle>
                    {indicioEditing ? 'Editar indicio' : 'Nuevo indicio'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Descripción"
                        value={indicioForm.descripcion}
                        onChange={(e) =>
                            setIndicioForm((prev) => ({ ...prev, descripcion: e.target.value }))
                        }
                        fullWidth
                        multiline
                        required
                    />
                    <TextField
                        label="Color"
                        value={indicioForm.color ?? ''}
                        onChange={(e) =>
                            setIndicioForm((prev) => ({ ...prev, color: e.target.value }))
                        }
                    />
                    <TextField
                        label="Tamaño"
                        value={indicioForm.tamanio ?? ''}
                        onChange={(e) =>
                            setIndicioForm((prev) => ({ ...prev, tamanio: e.target.value }))
                        }
                    />
                    <TextField
                        label="Peso"
                        value={indicioForm.peso ?? ''}
                        onChange={(e) =>
                            setIndicioForm((prev) => ({ ...prev, peso: e.target.value }))
                        }
                    />
                    <TextField
                        label="Ubicación"
                        value={indicioForm.ubicacion ?? ''}
                        onChange={(e) =>
                            setIndicioForm((prev) => ({ ...prev, ubicacion: e.target.value }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIndicioDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleGuardarIndicio} disabled={actionLoading} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogo de rechazo */}
            <Dialog open={rechazoDialogOpen} onClose={() => setRechazoDialogOpen(false)} fullWidth>
                <DialogTitle>Rechazar expediente</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Justificación"
                        value={rechazoJustificacion}
                        onChange={(e) => setRechazoJustificacion(e.target.value)}
                        fullWidth
                        required
                        multiline
                        minRows={2}
                    />
                    <TextField
                        label="Tipo de rechazo (opcional)"
                        value={rechazoTipo}
                        onChange={(e) => setRechazoTipo(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRechazoDialogOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmarRechazo}
                        disabled={actionLoading || !rechazoJustificacion.trim()}
                        variant="contained"
                        color="error"
                    >
                        Rechazar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación de eliminación de indicio */}
            <Dialog
                open={deleteIndicioDialogOpen}
                onClose={() => {
                    setDeleteIndicioDialogOpen(false);
                    setIndicioToDelete(null);
                }}
            >
                <DialogTitle>Eliminar indicio</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Seguro que deseas eliminar el indicio{' '}
                        <strong>{indicioToDelete?.descripcion}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteIndicioDialogOpen(false);
                            setIndicioToDelete(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleEliminarIndicio}
                        color="error"
                        variant="contained"
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}