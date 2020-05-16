import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { Alerta } from 'src/app/shared/models/alerta';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';

@Component({
  selector: 'dio-visualizar-filme',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.css']
})
export class VisualizarFilmesComponent implements OnInit {

  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';
  filme: Filme;
  id: number;

  constructor(private activeRoute: ActivatedRoute,
              private filmesService: FilmesService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];
    this.visualizar();
  }

  private visualizar(): void {
    this.filmesService.visualizar(this.id).subscribe({
      next: filme => {
        this.filme = filme;
      }, error: err => {
        console.log(err);
      }
    });
  }

  editar(): void {
    this.router.navigateByUrl('/filmes/cadastro/' + this.id);
  }

  excluir(): void {
    this.filmesService.excluir(this.id).subscribe({
      next: item => {
        this.router.navigateByUrl('/filmes');
      },
      error: err => {
        console.log(err);
      }
    });
  }

  openDialogConfirmacaoExclusao() {
    const config = {
      data: {
        titulo: 'Você tem certeza que deseja excluir?',
        descricao: 'Caso você tenha certeza wue deseja excluir, clique no botão OK.',
        corBtnSucesso: 'warn',
        corBtnCancelar: 'primary',
        possuiBtnFechar: true,
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe((opcao: boolean) => {
      if (opcao) {
        this.excluir();
      }
    });
  }
}
