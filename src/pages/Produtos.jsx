import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";
import { produtos } from "../data/mockData";

export default function Produtos() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Produtos
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Button variant="contained" sx={{ mb: 2 }}>
          Novo Produto
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.quantidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}