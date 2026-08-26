import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { projectApi, portfolioApi } from '../services/api';
import { ProjectRequest, Portfolio } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const ProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<ProjectRequest>({
    name: '',
    description: '',
    portfolioId: 0,
    projectManager: '',
    status: 'PLANNED',
    health: 'GREEN',
    priority: 'MEDIUM',
    budget: 0,
    actualCost: 0,
    completionPercentage: 0,
    startDate: '',
    endDate: '',
  });
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const portfolioRes = await portfolioApi.getAll({ page: 0, size: 100 });
        setPortfolios(portfolioRes.content);

        if (isEdit && id) {
          const project = await projectApi.getById(Number(id));
          setFormData({
            name: project.name,
            description: project.description,
            portfolioId: project.portfolioId,
            projectManager: project.projectManager || '',
            status: project.status,
            health: project.health,
            priority: project.priority,
            budget: project.budget,
            actualCost: project.actualCost,
            completionPercentage: project.completionPercentage,
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : '',
          });
        }
      } catch {
        toast.error('Failed to load form data');
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
    if (!formData.portfolioId) newErrors.portfolioId = 'Portfolio is required';
    if (!formData.projectManager.trim()) newErrors.projectManager = 'Manager is required';
    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if ((formData.completionPercentage ?? 0) < 0 || (formData.completionPercentage ?? 0) > 100) {
      newErrors.completionPercentage = 'Completion must be between 0 and 100';
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
        await projectApi.update(Number(id), formData);
        toast.success('Project updated successfully');
      } else {
        await projectApi.create(formData);
        toast.success('Project created successfully');
      }
      navigate('/projects');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save project';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProjectRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const portfolioOptions = portfolios.map((p) => ({ value: p.id, label: p.name }));

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
          onClick={() => navigate('/projects')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-navy-600">
            {isEdit ? 'Edit Project' : 'Create Project'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? 'Update project details' : 'Fill in the details to create a new project'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter project name"
              error={errors.name}
            />
            <Select
              label="Portfolio"
              value={formData.portfolioId || ''}
              onChange={(e) => handleChange('portfolioId', Number(e.target.value))}
              options={portfolioOptions}
              placeholder="Select portfolio"
              error={errors.portfolioId}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter project description"
                error={errors.description}
                rows={3}
              />
            </div>
            <Input
              label="Project Manager"
              value={formData.projectManager}
              onChange={(e) => handleChange('projectManager', e.target.value)}
              placeholder="Enter manager name"
              error={errors.projectManager}
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
              error={errors.completionPercentage}
              min={0}
              max={100}
            />
          </div>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Status & Timeline</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={[
                { value: 'PLANNED', label: 'Planned' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ON_HOLD', label: 'On Hold' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'DELAYED', label: 'Delayed' },
                { value: 'CANCELLED', label: 'Cancelled' },
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
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'CRITICAL', label: 'Critical' },
              ]}
            />
            <div />
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
          <Button variant="secondary" onClick={() => navigate('/projects')} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
            {isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};
