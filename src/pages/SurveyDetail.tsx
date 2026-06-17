import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input, TextArea } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { useAppStore } from '@/store';
import { formatDate, formatDateTime, isExpired } from '@/utils/date';
import { QUESTION_TYPE_LABELS } from '@/utils/constants';
import type { SurveyResponse } from '@/types';

const SurveyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, surveys, users, submitSurveyResponse } = useAppStore();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const survey = surveys.find(s => s.id === id);
  const totalParents = users.filter(u => u.role === 'parent').length;

  const existingResponse = useMemo(() => {
    if (!survey || !currentUser) return null;
    return survey.responses.find(r => r.parentId === currentUser.id);
  }, [survey, currentUser]);

  const expired = survey ? isExpired(survey.deadline) : true;
  const hasResponded = !!existingResponse;
  const canSubmit = !expired && !hasResponded && currentUser?.role === 'parent';

  if (!survey) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">问卷不存在</h2>
          <Button onClick={() => navigate('/surveys')}>返回列表</Button>
        </div>
      </PageContainer>
    );
  }

  const handleSingleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultipleAnswer = (questionId: string, value: string, checked: boolean) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      const updated = checked
        ? [...current, value]
        : current.filter(v => v !== value);
      return { ...prev, [questionId]: updated };
    });
  };

  const handleTextAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    const invalidQuestion = survey.questions.find(q => {
      if (!q.required) return false;
      const answer = answers[q.id];
      if (!answer) return true;
      if (Array.isArray(answer) && answer.length === 0) return true;
      if (typeof answer === 'string' && !answer.trim()) return true;
      return false;
    });

    if (invalidQuestion) {
      setError(`请完成必填项：${invalidQuestion.title}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const answerArray = survey.questions.map(q => ({
        questionId: q.id,
        value: answers[q.id] ?? (q.type === 'multiple' ? [] : '')
      }));

      submitSurveyResponse(survey.id, currentUser!.id, answerArray);
      navigate('/surveys');
    } catch (err) {
      setError('提交失败，请重试');
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

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant={!expired ? 'success' : 'default'} size="sm">
                  {!expired ? '进行中' : '已结束'}
                </Badge>
                {hasResponded && (
                  <Badge variant="success" size="sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      已回复
                    </span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                发布于 {formatDate(survey.createdAt)}
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">{survey.title}</h1>
            <p className="text-sm text-gray-500 mb-4">{survey.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>已回复 {survey.responses.length}/{totalParents} 人</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>截止：{formatDateTime(survey.deadline)}</span>
              </div>
            </div>
          </div>
        </Card>

        {hasResponded && existingResponse && (
          <Card className="mb-6">
            <div className="p-4 bg-green-50 border-b border-green-100">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">您已完成此问卷</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                提交时间：{formatDateTime(existingResponse.submittedAt)}
              </p>
            </div>
          </Card>
        )}

        {expired && !hasResponded && (
          <Card className="mb-6">
            <div className="p-4 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">问卷已截止</span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                此问卷已于 {formatDateTime(survey.deadline)} 截止，无法再提交
              </p>
            </div>
          </Card>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm mb-6">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {survey.questions.map((question, qIndex) => {
            const existingAnswer = existingResponse?.answers.find(a => a.questionId === question.id);
            const displayAnswer = hasResponded ? existingAnswer?.value : answers[question.id];

            return (
              <Card key={question.id}>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{question.title}</span>
                        {question.required && (
                          <Badge variant="danger" size="sm">必填</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{QUESTION_TYPE_LABELS[question.type]}</p>
                    </div>
                  </div>

                  {question.type === 'single' && question.options && (
                    <div className="space-y-2 ml-11">
                      {question.options.map((option, oIndex) => {
                        const checked = hasResponded
                          ? existingAnswer?.value === option
                          : answers[question.id] === option;

                        return (
                          <label
                            key={oIndex}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              canSubmit
                                ? checked
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-100 hover:border-gray-200'
                                : checked
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-100 opacity-60'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${question.id}`}
                              checked={checked}
                              onChange={() => canSubmit && handleSingleAnswer(question.id, option)}
                              disabled={!canSubmit}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                              {option}
                            </span>
                            {hasResponded && checked && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {question.type === 'multiple' && question.options && (
                    <div className="space-y-2 ml-11">
                      {question.options.map((option, oIndex) => {
                        const answerArray = hasResponded
                          ? (existingAnswer?.value as string[]) || []
                          : (answers[question.id] as string[]) || [];
                        const checked = answerArray.includes(option);

                        return (
                          <label
                            key={oIndex}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              canSubmit
                                ? checked
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-100 hover:border-gray-200'
                                : checked
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-100 opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => canSubmit && handleMultipleAnswer(question.id, option, e.target.checked)}
                              disabled={!canSubmit}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                              {option}
                            </span>
                            {hasResponded && checked && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {question.type === 'text' && (
                    <div className="ml-11">
                      {hasResponded ? (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {(existingAnswer?.value as string) || '未填写'}
                          </p>
                        </div>
                      ) : (
                        <TextArea
                          placeholder="请输入您的回答..."
                          value={(answers[question.id] as string) || ''}
                          onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                          rows={4}
                          maxLength={500}
                          disabled={!canSubmit}
                        />
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {canSubmit && (
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
              提交问卷
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SurveyDetail;
