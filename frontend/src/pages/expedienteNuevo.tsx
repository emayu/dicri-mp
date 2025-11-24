import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { createExpediente } from '../services/expedientesService';
import { useSession } from '../SessionContext';

export default function ExpedienteNuevoPage() {
  const [descripcion, setDescripcion] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const { session } = useSession();
  const roles = (session?.user as any)?.roles ?? [];
  const esTecnico = roles.includes('TECNICO');

  // Esto no esta totalmente definido pero solo los tecnicos pueden crear expedientes
  React.useEffect(() => {
    if (!esTecnico) {
      navigate('/expedientes');
    }
  }, [esTecnico, navigate]);

  const handleGuardar = async () => {


    try {
      setSaving(true);
      setError(null);

      const nuevo = await createExpediente({
        descripcion: descripcion.trim(),
      });

      // Redirigir al detalle del expediente recién creado
      navigate(`/expedientes/${nuevo.id}`);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al crear el expediente',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = () => {
    navigate('/expedientes');
  };

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, maxWidth: 700, width: '100%' }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5">Nuevo expediente</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {!esTecnico && (
            <Alert severity="warning">
              Esta acción está pensada para usuarios con rol TÉCNICO. 
              (El backend también debería validar el rol).
            </Alert>
          )}

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            required
            multiline
            minRows={3}
          />

          {session?.user && (
            <TextField
              label="Técnico que registra"
              value={session.user.name}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={saving || !esTecnico}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}