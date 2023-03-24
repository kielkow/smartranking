import mongoose from 'mongoose';

export const PartidaSchema = new mongoose.Schema(
  {
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
    },
    desafio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Desafio',
    },
    jogadores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogador',
      },
    ],
    def: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jogador',
    },
    resultado: [
      {
        set: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'partidas',
  },
);
