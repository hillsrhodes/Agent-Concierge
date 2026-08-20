import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Check, 
  X, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building2,
  Layers,
  Landmark,
  MapPin,
  Calendar,
  Crown
} from 'lucide-react';
import { KnowledgeItem, KnowledgeCategory } from '../../types';
import { api } from '../../services/api';

const CATEGORIES: { value: KnowledgeCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todas as Categorias', icon: Database },
  { value: 'developments', label: 'Empreendimentos & Enclaves (Egan Crest)', icon: Building2 },
  { value: 'methodology', label: 'Metodologia (5-Step Design & Build)', icon: Layers },
  { value: 'architecture', label: 'Arquitetura (Desert Modernism)', icon: Landmark },
  { value: 'legacy', label: 'Legado & Jim Rhodes (40+ Anos)', icon: Sparkles },
  { value: 'consultations', label: 'Consultorias & Liderança', icon: Calendar },
  { value: 'land_acquisition', label: 'Terrenos & Vistas Strip', icon: MapPin },
  { value: 'exclusive_services', label: 'Serviços VIP & Dossiers', icon: Crown },
  { value: 'general', label: 'Informações Gerais', icon: Database },
];

export const KnowledgeBaseManager: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: KnowledgeCategory;
    content: string;
    tags: string;
    isActive: boolean;
    priority: 'high' | 'normal' | 'low';
  }>({
    title: '',
    category: 'developments',
    content: '',
    tags: '',
    isActive: true,
    priority: 'normal',
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadItems();
  }, [selectedCategory]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getKnowledgeBase(selectedCategory, searchQuery);
      setItems(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadItems();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'gastronomy',
      content: '',
      tags: '',
      isActive: true,
      priority: 'normal',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      content: item.content,
      tags: item.tags.join(', '),
      isActive: item.isActive,
      priority: item.priority || 'normal',
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage('Título e Conteúdo são obrigatórios');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const parsedTags = formData.tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      if (editingItem) {
        const updated = await api.updateKnowledgeItem(editingItem.id, {
          title: formData.title,
          category: formData.category,
          content: formData.content,
          tags: parsedTags,
          isActive: formData.isActive,
          priority: formData.priority,
        });
        setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
        showNotification('Item atualizado com sucesso!');
      } else {
        const created = await api.createKnowledgeItem({
          title: formData.title,
          category: formData.category,
          content: formData.content,
          tags: parsedTags,
          isActive: formData.isActive,
          priority: formData.priority,
        });
        setItems(prev => [created, ...prev]);
        showNotification('Novo item adicionado à base de conhecimento!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!window.confirm(`Deseja realmente excluir o item "${title}" da base de conhecimento?`)) {
      return;
    }
    try {
      await api.deleteKnowledgeItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showNotification('Item excluído com sucesso.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao excluir item');
    }
  };

  const handleToggleStatus = async (item: KnowledgeItem) => {
    try {
      const updated = await api.updateKnowledgeItem(item.id, { isActive: !item.isActive });
      setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
      showNotification(`Item marcado como ${updated.isActive ? 'Ativo' : 'Inativo'}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao atualizar status');
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Deseja recarregar os dados padrão da base de conhecimento?')) {
      return;
    }
    setIsLoading(true);
    try {
      const seeded = await api.seedKnowledgeBase();
      setItems(seeded);
      showNotification('Base de conhecimento restaurada com sucesso!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao restaurar');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getCategoryBadge = (cat: KnowledgeCategory) => {
    const found = CATEGORIES.find(c => c.value === cat);
    return found ? found.label : cat;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            Base de Conhecimento
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cadastre regras, horários, restaurantes e serviços que a IA utiliza para atender os hóspedes.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleSeedDefaults}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            title="Restaurar padrão"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            id="btn-add-knowledge-item"
            onClick={openCreateModal}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filters & Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar na base..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
        </form>

      </div>

      {/* Knowledge Cards Grid */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-zinc-400">
          <Sparkles className="h-5 w-5 text-zinc-900 animate-spin mr-2" />
          <span>Consultando base de dados...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-12 text-center">
          <Database className="mx-auto h-8 w-8 text-zinc-300" />
          <h3 className="mt-3 text-sm font-bold text-zinc-800">Nenhum item encontrado</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Cadastre um novo serviço ou clique em "Restaurar Padrão" para recarregar informações de exemplo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-xs ${
                item.isActive
                  ? 'border-zinc-200 bg-white hover:border-zinc-400'
                  : 'border-zinc-200 bg-zinc-50 opacity-60'
              }`}
            >
              <div>
                {/* Header: Category & Active status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-700">
                    {getCategoryBadge(item.category)}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      item.isActive ? 'text-emerald-700 hover:text-emerald-800' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                    title={item.isActive ? 'Desativar da IA' : 'Ativar para a IA'}
                  >
                    {item.isActive ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Ativo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Inativo</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">
                  {item.title}
                </h4>

                {/* Content */}
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-4">
                  {item.content}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 flex items-center gap-1 font-medium"
                    >
                      <Tag className="h-2.5 w-2.5 text-zinc-400" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">
                    Atualizado em {new Date(item.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
                      title="Editar item"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Excluir item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Database className="h-4 w-4 text-zinc-700" />
                {editingItem ? 'Editar Informação' : 'Nova Informação para o Concierge'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Título / Nome do Serviço
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Restaurante Le Miroir, Spa L'Élixir..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as KnowledgeCategory })}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none cursor-pointer"
                >
                  <option value="developments">Empreendimentos & Enclaves (Egan Crest)</option>
                  <option value="methodology">Metodologia (5-Step Design & Build)</option>
                  <option value="architecture">Arquitetura (Desert Modernism)</option>
                  <option value="legacy">Legado & Jim Rhodes (40+ Anos)</option>
                  <option value="consultations">Consultorias & Liderança</option>
                  <option value="land_acquisition">Terrenos & Vistas Strip</option>
                  <option value="exclusive_services">Serviços VIP & Dossiers</option>
                  <option value="general">Informações Gerais</option>
                </select>
              </div>

              {/* Content Details */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Conteúdo & Detalhes (Injetados no Prompt do Gemini)
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Descreva detalhadamente horários, regras, cardápio, orientações..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Palavras-chave / Tags (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="restaurante, jantar, michelin, reserva"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-xs text-zinc-800 font-semibold">
                    Ativo (Disponível imediatamente para o Gemini responder)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Salvando...' : editingItem ? 'Atualizar Item' : 'Criar Registro'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
