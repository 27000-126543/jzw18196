import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, FileText, AlertTriangle, HelpCircle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input, Select, TextArea } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { QUESTION_TYPE_LABELS } from '@/utils/constants';
import { generateId } from '@/utils/date';
import type { SurveyQuestion, QuestionType } from '@/types';

const SurveyNew = () => {
  const navigate = useNavigate();
  const { createSurvey } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    {
      id: generateId(),
      type: 'single',
      title: '',
      options: ['', ''],
      required: true
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateId(),
        type: 'single',
        title: '',
        options: ['', ''],
        required: true
      }
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options && q.options.length > 2) {
        return { ...q, options: q.options.filter((_, i) => i !== optionIndex) };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('请填写问卷标题');
      return;
    }
    if (!description.trim()) {
      setError('请填写问卷描述');
      return;
    }
    if (!deadline) {
      setError('请选择截止日期');
      return;
    }
    if (new Date(deadline) <= new Date()) {
      setError('截止日期必须晚于当前时间');
      return;
    }

    const invalidQuestion = questions.findIndex(q => !q.title.trim());
    if (invalidQuestion >= 0) {
      setError(`第 ${invalidQuestion + 1} 题请填写问题标题`);
      return;
    }

    const invalidOptions = questions.findIndex(q =>
      (q.type === 'single' || q.type === 'multiple') &&
      (!q.options || q.options.filter(o => o.trim()).length < 2)
    );
    if (invalidOptions >= 0) {
      setError(`第 ${invalidOptions + 1} 题至少需要2个有效选项`);
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedQuestions = questions.map(q => ({
        ...q,
        title: q.title.trim(),
        options: (q.type === 'single' || q.type === 'multiple')
          ? q.options?.filter(o => o.trim()).map(o => o.trim())
          : undefined
      }));

      createSurvey({
        title: title.trim(),
        description: description.trim(),
        deadline: new Date(deadline).toISOString(),
        questions: cleanedQuestions
      });

      navigate('/surveys');
    } catch (err) {
      setError('创建失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">发起新问卷</h1>
          <p className="text-sm text-gray-500 mt-1">创建问卷收集家长意见，系统自动汇总统计</p>
        </div>

        <Card className="mb-6">
          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                问卷标题
              </label>
              <Input
                placeholder="例如：是否同意参加秋游活动"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/50</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                问卷描述
              </label>
              <TextArea
                placeholder="简单介绍问卷目的和填写须知..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/200</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                截止日期
              </label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">问题列表</h2>
          <Button variant="outline" size="sm" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            添加问题
          </Button>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={question.id} className="mb-4">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                    {qIndex + 1}
                  </span>
                  <Select
                    value={question.type}
                    onChange={(e) => {
                      const type = e.target.value as QuestionType;
                      updateQuestion(question.id, {
                        type,
                        options: type === 'text' ? undefined : (question.options || ['', ''])
                      });
                    }}
                    className="w-32"
                  >
                    {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                  {question.required && (
                    <Badge variant="danger" size="sm">必填</Badge>
                  )}
                </div>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  问题标题
                </label>
                <Input
                  placeholder="请输入问题..."
                  value={question.title}
                  onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                />
              </div>

              {(question.type === 'single' || question.type === 'multiple') && question.options && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    选项设置
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 w-6">{oIndex + 1}.</span>
                        <Input
                          placeholder={`选项 ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(question.id, oIndex, e.target.value)}
                        />
                        {question.options && question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(question.id, oIndex)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addOption(question.id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加选项
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  必填项
                </label>
              </div>
            </div>
          </Card>
        ))}

        <div className="flex items-center justify-end gap-3 mt-6 pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            发布问卷
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default SurveyNew;
