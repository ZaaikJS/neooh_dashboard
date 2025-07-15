'use client'
import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import toast from "react-hot-toast";

export default function Generate() {
    const [formData, setFormData] = useState({
        unidade: '',
        endereco: '',
        data: '',
        horainicio: '',
        horatermino: '',
        demanda: '',
        atendimento: '',
        pendencias: '',
        tecnico: '',
        nome: '',
        telefone: '',
        email: '',
        cargo: '',
        cpf: ''
    });

    const [canals, setCanals] = useState([{ canal: '', localizacao: '' }]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleChannelChange = (index: number, field: 'canal' | 'localizacao', value: string) => {
        const newCanals = [...canals];
        newCanals[index][field] = value;
        setCanals(newCanals);
    };

    const handleAddChannel = () => {
        setCanals([...canals, { canal: '', localizacao: '' }]);
    };

    const renderInput = (
        id: string,
        label: string,
        value: string,
        onChange: (val: string) => void,
        isTextarea = false
    ) => {
        const baseClass =
            "peer w-full border-2 border-gray-300 bg-transparent pt-5 p-2 text-sm text-gray-900 placeholder-transparent focus:border-neutral-950 focus:outline-none";
        const labelClass = `absolute font-semibold uppercase transition-all cursor-text
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
      peer-focus:left-2.5 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-950`;

        return (
            <div className="relative w-full" key={id}>
                {isTextarea ? (
                    <textarea
                        id={id}
                        required
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseClass}
                        placeholder={label}
                    />
                ) : (
                    <input
                        id={id}
                        type="text"
                        required
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseClass}
                        placeholder={label}
                    />
                )}
                <label htmlFor={id} className={labelClass}>{label}</label>
            </div>
        );
    };

    const generateRat = () => {
        toast.error('Ocorreu um erro na geração da RAT.', {
            duration: 4000,
            style: { background: '#d32f2f', color: '#fff' }
        });
    }

    return (
        <div className="container mx-auto p-8 m-8 mt-28 bg-white shadow-lg shadow-black/40">
            <p className="text-xl font-semibold">Gerador de RAT/Relatório</p>
            <div className="grid grid-cols-2 gap-8">
                {/* Coluna esquerda */}
                <div className="flex flex-col gap-4">
                    <p className="font-semibold opacity-80">Informações do atendimento</p>
                    {renderInput("unidade", "Unidade", formData.unidade, val => handleChange('unidade', val))}
                    {renderInput("endereco", "Endereço", formData.endereco, val => handleChange('endereco', val))}
                    {renderInput("data", "Data", formData.data, val => handleChange('data', val))}
                    {renderInput("horainicio", "Horário início", formData.horainicio, val => handleChange('horainicio', val))}
                    {renderInput("horatermino", "Horário término", formData.horatermino, val => handleChange('horatermino', val))}
                    {renderInput("demanda", "Descrição da demanda", formData.demanda, val => handleChange('demanda', val), true)}
                    {renderInput("atendimento", "Descrição do atendimento", formData.atendimento, val => handleChange('atendimento', val), true)}
                    {renderInput("pendencias", "Pendências", formData.pendencias, val => handleChange('pendencias', val), true)}
                    {renderInput("tecnico", "Técnico", formData.tecnico, val => handleChange('tecnico', val))}
                    <p className="font-semibold opacity-80">Dados para assinatura</p>
                    {renderInput("nome", "Nome", formData.nome, val => handleChange('nome', val))}
                    {renderInput("telefone", "Telefone", formData.telefone, val => handleChange('telefone', val))}
                    {renderInput("email", "Email", formData.email, val => handleChange('email', val))}
                    {renderInput("cargo", "Cargo", formData.cargo, val => handleChange('cargo', val))}
                    {renderInput("cpf", "CPF (opcional)", formData.cpf, val => handleChange('cpf', val))}
                </div>

                {/* Coluna direita */}
                <div className="flex flex-col gap-4">
                    <p className="font-semibold opacity-80">Canais instalados</p>
                    <div className="w-full flex flex-col gap-8">
                        {canals.map((c, i) => (
                            <div className="flex flex-col gap-4" key={i}>
                                {renderInput(`canal-${i}`, `Canal (${i + 1})`, c.canal, val => handleChannelChange(i, 'canal', val))}
                                {renderInput(`local-${i}`, `Localização do equipamento (${i + 1})`, c.localizacao, val => handleChannelChange(i, 'localizacao', val))}
                            </div>
                        ))}
                        <div className="flex justify-center cursor-pointer" onClick={handleAddChannel}>
                            <IoIosAddCircle className="text-4xl text-green-600 hover:text-green-700 transition-colors" />
                        </div>
                    </div>
                </div>
                <button
                    className={"col-span-2 w-fit mx-auto bg-green-600 px-8 py-4 text-white hover:bg-green-700 cursor-pointer active:bg-green-600"}
                    onClick={() => generateRat()}
                >
                    Gerar RAT
                </button>
            </div>
        </div>
    );
}