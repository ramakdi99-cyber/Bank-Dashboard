import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { portfolioApi } from '../services/api';
import { PortfolioRequest } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const PortfolioFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<PortfolioRequest>({
    name: '',
    description: '',
    owner: '',
    status: 'ACTIVE',
    health: 'GREEN',
    budget: 0,
    actualCost: 0,
    startDate: '',
    endDate: '',
    completionPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const portfolio = await portfolioApi.getById(Number(id));
        setFormData({
          name: portfolio.name,
          description: portfolio.description,
          owner: portfolio.owner,
          status: portfolio.status,
          health: portfolio.health,
          budget: portfolio.budget,
          actualCost: portfolio.actualCost,
          startDate: portfolio.startDate ? portfolio.startDate.split('T')[0] : '',
          endDate: portfolio.endDate ? portfolio.endDate.split('T')[0] : '',
          completionPercentage: portfolio.completionPercentage,
        });
      } catch {
        toast.error('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit && id) {
        await portfolioApi.update(Number(id), formData);
        toast.success('Portfolio updated successfully');
      } else {
        await portfolioApi.create(formData);
        toast.success('Portfolio created successfully');
      }
      navigate('/portfolios');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save portfolio';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PortfolioRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/portfolios')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-navy-600">
            {isEdit ? 'Edit Portfolio' : 'Create Portfolio'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? 'Update portfolio details' : 'Fill in the details to create a new portfolio'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Information</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Portfolio Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter portfolio name"
              error={errors.name}
            />
            <Input
              label="Owner"
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              placeholder="Enter owner name"
              error={errors.owner}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter portfolio description"
                error={errors.description}
                rows={3}
              />
            </div>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'ON_HOLD', label: 'On Hold' },
              ]}
            />
            <Select
              label="Health"
              value={formData.health}
              onChange={(e) => handleChange('health', e.target.value)}
              options={[
                { value: 'GREEN', label: 'Green' },
                { value: 'AMBER', label: 'Amber' },
                { value: 'RED', label: 'Red' },
              ]}
            />
            <Input
              label="Budget (USD)"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => handleChange('budget', Number(e.target.value))}
              placeholder="0"
              error={errors.budget}
              min={0}
            />
            <Input
              label="Actual Cost (USD)"
              type="number"
              value={formData.actualCost || ''}
              onChange={(e) => handleChange('actualCost', Number(e.target.value))}
              placeholder="0"
              min={0}
            />
            <Input
              label="Completion %"
              type="number"
              value={formData.completionPercentage || ''}
              onChange={(e) => handleChange('completionPercentage', Number(e.target.value))}
              placeholder="0"
              min={0}
              max={100}
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              error={errors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              error={errors.endDate}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => navigate('/portfolios')} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
            {isEdit ? 'Update Portfolio' : 'Create Portfolio'}
          </Button>
        </div>
      </form>
    </div>
  );
};
