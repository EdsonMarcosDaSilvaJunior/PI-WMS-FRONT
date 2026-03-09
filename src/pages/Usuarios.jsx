import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { usuarios } from "../data/mockData";

export default function Usuarios() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Usuários
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}