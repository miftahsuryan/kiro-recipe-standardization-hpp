import React, { useState } from 'react';
import type { Ingredient, MeasurementUnit } from '../../shared/types';
import { useIngredientStore } from '../../stores/ingredientStore';
import { formatCurrency } from '../../shared/lib/calculations';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { useToast } from '../../shared/hooks/useToast';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Modal } from '../../shared/components/Modal';
import { ToastContainer } from '../../shared/components/Toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Deterministic "recipe count" for delete dialog preview */
function fakeRecipeCount(id: string): number {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return sum % 5;
}

const MEASUREMENT_UNITS: MeasurementUnit[] = [
  'g', 'kg', 'ml', 'l', 'sdt', 'sdm', 'buah', 'butir', 'lembar',
];

const UNIT_LABELS: Record<MeasurementUnit, string> = {
  g: 'Gram (g)',
  kg: 'Kilogram (kg)',
  ml: 'Mililiter (ml)',
  l: 'Liter (l)',
  sdt: 'Sendok Teh (sdt)',
  sdm: 'Sendok Makan (sdm)',
  buah: 'Buah',
  butir: 'Butir',
  lembar: 'Lembar',
};

// ─── IngredientPriceRow ───────────────────────────────────────────────────────

interface IngredientPriceRowProps {
  ingredient: Ingredient;
  onDelete: (ingredient: Ingredient) => void;
  onPriceUpdated: (name: string) => void;
}

function IngredientPriceRow({ ingredient, onDelete, onPriceUpdated }: IngredientPriceRowProps) {
  const updateIngredientPrice = useIngredientStore((s) => s.updateIngredientPrice);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');

  const startEdit = () => {
    setEditValue(String(ingredient.pricePerUnit));
    setEditError('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditError('');
  };

  const saveEdit = () => {
    const parsed = parseFloat(editValue.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) {
      setEditError('Harga harus berupa angka positif');
      return;
    }
    if (parsed > 999_999_999) {
      setEditError('Harga melebihi batas maksimum');
      return;
    }
    updateIngredientPrice(ingredient.id, parsed);
    setIsEditing(false);
    onPriceUpdated(ingredient.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <tr className="hover:bg-amber-50/30 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{ingredient.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{ingredient.unit}</td>
      <td className="px-4 py-3 text-sm">
        {isEditing ? (
          <div className="flex items-start gap-2">
            <Input
              type="number"
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                setEditError('');
              }}
              onKeyDown={handleKeyDown}
              error={editError}
              min="0.01"
              max="999999999"
              step="0.01"
              autoFocus
              className="w-40"
              aria-label={`Harga satuan ${ingredient.name}`}
            />
            <div className="flex gap-1 pt-1">
              <Button size="sm" variant="primary" onClick={saveEdit}>
                Simpan
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <span className="text-gray-900 font-medium">{formatCurrency(ingredient.pricePerUnit)}</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(ingredient.lastUpdated)}</td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
              aria-label={`Edit harga ${ingredient.name}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
          <button
            onClick={() => onDelete(ingredient)}
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
            aria-label={`Hapus ${ingredient.name}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── DeleteIngredientDialog ───────────────────────────────────────────────────

interface DeleteIngredientDialogProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  onConfirm: (ingredient: Ingredient) => void;
}

function DeleteIngredientDialog({ ingredient, onClose, onConfirm }: DeleteIngredientDialogProps) {
  if (!ingredient) return null;
  const recipeCount = fakeRecipeCount(ingredient.id);

  return (
    <Modal
      isOpen={!!ingredient}
      onClose={onClose}
      title="Hapus Bahan"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batalkan
          </Button>
          <Button variant="danger" onClick={() => onConfirm(ingredient)}>
            Hapus Bahan
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-gray-900 font-medium">
          Hapus bahan <span className="text-red-600">"{ingredient.name}"</span>?
        </p>
        <p className="text-sm text-gray-600">
          {recipeCount > 0
            ? `Bahan ini digunakan dalam ${recipeCount} resep. Setelah dihapus, bahan akan ditandai tidak aktif dan tidak tersedia untuk resep baru.`
            : 'Setelah dihapus, bahan akan ditandai tidak aktif dan tidak tersedia untuk resep baru.'}
        </p>
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-xs text-red-700">
            Tindakan ini tidak dapat dibatalkan melalui halaman ini.
          </p>
        </div>
      </div>
    </Modal>
  );
}

// ─── AddIngredientModal ───────────────────────────────────────────────────────

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (name: string) => void;
}

interface AddIngredientForm {
  name: string;
  unit: MeasurementUnit | '';
  pricePerUnit: string;
}

interface AddIngredientErrors {
  name?: string;
  unit?: string;
  pricePerUnit?: string;
}

function generateId(): string {
  return 'ing-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function AddIngredientModal({ isOpen, onClose, onAdded }: AddIngredientModalProps) {
  const { ingredients, setIngredients } = useIngredientStore();
  const [form, setForm] = useState<AddIngredientForm>({ name: '', unit: '', pricePerUnit: '' });
  const [errors, setErrors] = useState<AddIngredientErrors>({});

  const resetForm = () => {
    setForm({ name: '', unit: '', pricePerUnit: '' });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: AddIngredientErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama bahan wajib diisi';
    if (!form.unit) newErrors.unit = 'Satuan wajib dipilih';
    const price = parseFloat(form.pricePerUnit.replace(',', '.'));
    if (!form.pricePerUnit || isNaN(price) || price <= 0) {
      newErrors.pricePerUnit = 'Harga harus berupa angka positif';
    } else if (price > 999_999_999) {
      newErrors.pricePerUnit = 'Harga melebihi batas maksimum';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newIngredient: Ingredient = {
      id: generateId(),
      name: form.name.trim(),
      unit: form.unit as MeasurementUnit,
      pricePerUnit: parseFloat(form.pricePerUnit.replace(',', '.')),
      lastUpdated: new Date().toISOString(),
      isActive: true,
    };

    setIngredients([...ingredients, newIngredient]);
    onAdded(newIngredient.name);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah Bahan Baru"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit" form="add-ingredient-form">
            Simpan Bahan
          </Button>
        </>
      }
    >
      <form id="add-ingredient-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nama Bahan"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          placeholder="cth. Bawang Bombay"
          autoFocus
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="satuan-select" className="text-sm font-medium text-gray-700">
            Satuan
          </label>
          <select
            id="satuan-select"
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value as MeasurementUnit | '' }))}
            className={[
              'rounded-md border px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
              errors.unit ? 'border-red-500' : 'border-gray-300',
            ].join(' ')}
            aria-invalid={errors.unit ? 'true' : undefined}
          >
            <option value="">— Pilih satuan —</option>
            {MEASUREMENT_UNITS.map((u) => (
              <option key={u} value={u}>{UNIT_LABELS[u]}</option>
            ))}
          </select>
          {errors.unit && (
            <p role="alert" className="text-xs text-red-600">{errors.unit}</p>
          )}
        </div>

        <Input
          label="Harga Satuan (Rp)"
          type="number"
          value={form.pricePerUnit}
          onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))}
          error={errors.pricePerUnit}
          placeholder="cth. 35000"
          min="0.01"
          step="0.01"
        />
      </form>
    </Modal>
  );
}

// ─── IngredientTable ──────────────────────────────────────────────────────────

interface IngredientTableProps {
  ingredients: Ingredient[];
  onDeleteRequest: (ingredient: Ingredient) => void;
  onPriceUpdated: (name: string) => void;
}

function IngredientTable({ ingredients, onDeleteRequest, onPriceUpdated }: IngredientTableProps) {
  const sorted = [...ingredients].sort((a, b) => a.name.localeCompare(b.name, 'id'));

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base font-medium">Tidak ada bahan ditemukan</p>
        <p className="text-sm mt-1">Coba kata kunci lain atau tambahkan bahan baru</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Nama Bahan
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Satuan
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Harga Satuan
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Terakhir Diperbarui
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((ing) => (
            <IngredientPriceRow
              key={ing.id}
              ingredient={ing}
              onDelete={onDeleteRequest}
              onPriceUpdated={onPriceUpdated}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── IngredientManagementPage ─────────────────────────────────────────────────

export function IngredientManagementPage() {
  const { ingredients, markIngredientInactive } = useIngredientStore();
  const { toasts, showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeIngredients = ingredients.filter((ing) => ing.isActive);

  const filteredIngredients = debouncedSearch.trim()
    ? activeIngredients.filter((ing) =>
        ing.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : activeIngredients;

  const handleConfirmDelete = (ingredient: Ingredient) => {
    markIngredientInactive(ingredient.id);
    setDeletingIngredient(null);
    showToast('Bahan berhasil dihapus', 'success');
  };

  const handlePriceUpdated = (name: string) => {
    showToast(`Harga ${name} berhasil diperbarui`, 'success');
  };

  const handleIngredientAdded = (name: string) => {
    showToast(`Bahan "${name}" berhasil ditambahkan`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Bahan Baku</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola harga bahan terpusat — perubahan otomatis memperbarui HPP semua resep terkait
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            className="sm:self-start"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Bahan
          </Button>
        </div>

        {/* Search + Stats bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama bahan..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                aria-label="Cari bahan"
              />
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              <span className="font-semibold text-gray-700">{filteredIngredients.length}</span>{' '}
              {debouncedSearch ? 'hasil ditemukan' : 'bahan aktif'}
            </p>
          </div>

          {/* Table */}
          <IngredientTable
            ingredients={filteredIngredients}
            onDeleteRequest={setDeletingIngredient}
            onPriceUpdated={handlePriceUpdated}
          />
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteIngredientDialog
        ingredient={deletingIngredient}
        onClose={() => setDeletingIngredient(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Add Modal */}
      <AddIngredientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={handleIngredientAdded}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
