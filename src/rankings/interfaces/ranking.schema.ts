import mongoose from 'mongoose';

export const RankingSchema = new mongoose.Schema(
  {
    desafio: {
      type: String,
    },
    partida: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partida',
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
    },
    jogador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jogador',
    },
    evento: {
      type: String,
    },
    operacao: {
      type: String,
    },
    pontos: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'rankings',
  },
);
