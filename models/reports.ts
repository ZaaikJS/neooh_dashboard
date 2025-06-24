import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    unidade: {type: String},
    endereco: {type: String},
    data: {type: String},
    horainicio: {type: String},
    horatermino: {type: String},
    demanda: {type: String},
    atendimento: {type: String},
    pendencias: {type: String},
    tecnico: {type: String},
    assinatura: [
        {
            nome: {type: String},
            telefone: {type: String},
            email: {type: String},
            cargo: {type: String},
            cpf: {type: String},
        }
    ]
}, {
    timestamps: true,
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);