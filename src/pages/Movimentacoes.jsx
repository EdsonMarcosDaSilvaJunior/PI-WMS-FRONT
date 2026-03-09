import {
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack
} from "@mui/material";

export default function Movimentacoes() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Movimentações
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2} maxWidth={400}>
          <TextField select label="Tipo">
            <MenuItem value="entrada">Entrada</MenuItem>
            <MenuItem value="saida">Saída</MenuItem>
            <MenuItem value="transferencia">Transferência</MenuItem>
          </TextField>

          <TextField label="Produto" />

          <TextField label="Quantidade" type="number" />

          <Button variant="contained">
            Registrar Movimentação
          </Button>
        </Stack>
      </Paper>
    </>
  );
}