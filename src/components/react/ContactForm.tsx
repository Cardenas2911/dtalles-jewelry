import React, { useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        reason: 'Asesoría de Regalo',
        message: '',
        newsletter: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            // Reset form optionally or keep it to show what was sent? 
            // Specs say: "Mostrar un mensaje de éxito suave en el mismo lugar"
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (status === 'success') {
        return (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/30">
                    <span className="material-symbols-outlined text-[#d4af37] text-3xl">check</span>
                </div>
                <h3 className="text-2xl font-serif text-[#FAFAF5] mb-2">Mensaje Recibido</h3>
                <p className="text-gray-400 font-light">
                    Gracias por confiarnos tus dudas. <br />
                    Cuidaremos cada detalle de tu solicitud.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-[#d4af37] text-sm uppercase tracking-widest hover:text-white transition-colors"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Name Input */}
            <div className="group relative z-0 w-full">
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-base text-[#FAFAF5] bg-transparent border-0 border-b border-[#666666] appearance-none focus:outline-none focus:ring-0 focus:border-[#d4af37] peer transition-colors"
                    placeholder=" "
                    required
                />
                <label
                    htmlFor="name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#d4af37] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    ¿A quién tenemos el gusto de dirigirnos?
                </label>
            </div>

            {/* Contact Input */}
            <div className="group relative z-0 w-full">
                <input
                    type="text"
                    name="contact"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-base text-[#FAFAF5] bg-transparent border-0 border-b border-[#666666] appearance-none focus:outline-none focus:ring-0 focus:border-[#d4af37] peer transition-colors"
                    placeholder=" "
                    required
                />
                <label
                    htmlFor="contact"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#d4af37] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Tu WhatsApp o Email
                </label>
            </div>

            {/* Reason Dropdown */}
            <div className="group relative z-0 w-full">
                <select
                    name="reason"
                    id="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-base text-[#FAFAF5] bg-transparent border-0 border-b border-[#666666] appearance-none focus:outline-none focus:ring-0 focus:border-[#d4af37] peer transition-colors"
                >
                    <option value="Asesoría de Regalo" className="bg-[#050505]">Asesoría de Regalo</option>
                    <option value="Estado de mi Pedido" className="bg-[#050505]">Estado de mi Pedido</option>
                    <option value="Vender mi Oro" className="bg-[#050505]">Vender mi Oro</option>
                    <option value="Garantía" className="bg-[#050505]">Garantía</option>
                </select>
                <label
                    htmlFor="reason"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#d4af37] peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Motivo
                </label>
            </div>

            {/* Message Textarea */}
            <div className="group relative z-0 w-full">
                <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="block py-2.5 px-0 w-full text-base text-[#FAFAF5] bg-transparent border-0 border-b border-[#666666] appearance-none focus:outline-none focus:ring-0 focus:border-[#d4af37] peer transition-colors resize-none"
                    placeholder=" "
                    required
                ></textarea>
                <label
                    htmlFor="message"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#d4af37] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    ¿Cómo podemos ayudarte?
                </label>
            </div>

            {/* Newsletter Checkbox (Anti-Dark Pattern: Default Unchecked) */}
            <div className="flex items-center mb-4">
                <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#d4af37] bg-transparent border-gray-600 rounded focus:ring-[#d4af37] focus:ring-offset-gray-800"
                />
                <label htmlFor="newsletter" className="ml-3 text-sm font-light text-gray-400 select-none cursor-pointer">
                    Quiero recibir ofertas exclusivas de DTalles
                </label>
            </div>

            {/* Submit Button (Ghost Button) */}
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full md:w-auto px-12 py-4 bg-transparent border border-[#d4af37] text-[#d4af37] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-[#050505] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {status === 'submitting' ? 'Enviando...' : 'Iniciar Conversación'}
            </button>
        </form>
    );
}
