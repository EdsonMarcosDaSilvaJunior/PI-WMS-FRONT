import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const localizacoes = [
  { id: 1, zona: "A", corredor: "1", prateleira: "01" },
  { id: 2, zona: "A", corredor: "2", prateleira: "03" },
  { id: 3, zona: "B", corredor: "1", prateleira: "02" }
];

export default function Localizacoes() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Localizações
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Zona</TableCell>
              <TableCell>Corredor</TableCell>
              <TableCell>Prateleira</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {localizacoes.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell>{loc.id}</TableCell>
                <TableCell>{loc.zona}</TableCell>
                <TableCell>{loc.corredor}</TableCell>
                <TableCell>{loc.prateleira}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}