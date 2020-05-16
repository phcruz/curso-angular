import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;
  id: number;

  constructor(private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              public valicacao: ValidarCamposService,
              private filmesService: FilmesService,
              private dialog: MatDialog,
              private router: Router) { }

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'];
    if (this.id) {
      this.buscarFilme();
    } else {
      this.criarFormulario(this.criarFilmeBranco());
    }

    this.generos = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção científica', 'Romance', 'Terror'];
  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }

    const filme = this.cadastro.getRawValue() as Filme;
    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
    } else {
      this.salvar(filme);
    }
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe({
      next: filmes => {
        this.openDialogSucesso();
      },
      error: err => {
        this.openDialogErro();
        console.log(err);
      }
    });
  }

  private editar(filme: Filme): void {
    this.filmesService.editar(filme).subscribe({
      next: filmes => {
        this.openDialogSucessoEdicao();
      },
      error: err => {
        this.openDialogErroEdicao();
        console.log(err);
      }
    });
  }

  openDialogSucesso() {
    const config = {
      data: {
        btnSucess: 'Ir para listagem',
        btnCancelar: 'Cadastrar novo filme',
        corBtnCancelar: 'primary',
        possuiBtnFechar: true,
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe((opcao: boolean) => {
      if (opcao) {
        this.router.navigateByUrl('filmes');
      } else {
        this.reiniciarForm();
      }
    });
  }

  openDialogSucessoEdicao() {
    const config = {
      data: {
        descricao: 'Seu registro foi atualizado com sucesso.',
        btnSucess: 'Ir para listagem'
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe((opcao: boolean) => {
      if (opcao) {
        this.router.navigateByUrl('filmes');
      }
    });
  }

  openDialogErro() {
    const config = {
      data: {
        titulo: 'Erro ao salvar o registro',
        descricao: 'Não foi possível salvar seu registro. Por favor tente novamente mais tarde.',
        corBtnSucesso: 'warn',
        btnSucess: 'Fechar',
        possuiBtnFechar: false,
      } as Alerta
    };
    this.dialog.open(AlertaComponent, config);
  }

  openDialogErroEdicao() {
    const config = {
      data: {
        titulo: 'Erro ao editar o registro',
        descricao: 'Não foi possível editar seu registro. Por favor tente novamente mais tarde.',
        corBtnSucesso: 'warn',
        btnSucess: 'Fechar',
        possuiBtnFechar: false,
      } as Alerta
    };
    this.dialog.open(AlertaComponent, config);
  }

  buscarFilme() {
    this.filmesService.visualizar(this.id).subscribe({
      next: filme => {
        this.criarFormulario(filme);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(5), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, Validators.minLength(10)],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFilmeBranco(): Filme {
    const filme = {
      titulo: null,
      urlFoto: null,
      dtLancamento: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme;
    return filme;
  }
}
