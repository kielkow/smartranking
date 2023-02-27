import mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    telefoneCelular: {
      type: String,
      unique: true,
    },
    ranking: {
      type: String,
    },
    posicaoRanking: {
      type: Number,
    },
    urlFotoJogador: {
      type: String,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
    },
  },
  {
    timestamps: true,
    collection: 'jogadores',
  },
);
