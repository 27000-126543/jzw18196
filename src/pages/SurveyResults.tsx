import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Clock, BarChart3, PieChart, FileText, Download, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { formatDate, formatDateTime, isExpired } from '@/utils/date';
import { QUESTION_TYPE_LABELS } from '@/utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import type { SurveyQuestion } from '@/types';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const SurveyResults = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, surveys, users, getStudentById } = useAppStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'responses'>('summary');

  const survey = surveys.find(s => s.id === id);
  const totalParents = users.filter(u => u.role === 'parent').length;

  if (!survey) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">问卷不存在</h2>
          <Button onClick={() => navigate('/surveys')}>返回列表</Button>
        </div>
      </PageContainer>
    );
  }

  const expired = isExpired(survey.deadline);
  const responseCount = survey.responses.length;
  const responsePercent = totalParents > 0 ? Math.round((responseCount / totalParents) * 100) : 0;

  const questionStats = useMemo(() => {
    return survey.questions.map(question => {
      const answers = survey.responses.map(r =>
        r.answers.find(a => a.questionId === question.id)?.value
      ).filter(Boolean);

      if (question.type === 'text') {
        return {
          question,
          type: 'text' as const,
          answers: answers as string[]
        };
      }

      const optionCounts: Record<string, number> = {};
      question.options?.forEach(opt => { optionCounts[opt] = 0; });

      answers.forEach(answer => {
        if (Array.isArray(answer)) {
          answer.forEach(a => { optionCounts[a] = (optionCounts[a] || 0) + 1; });
        } else if (answer) {
          optionCounts[answer] = (optionCounts[answer] || 0) + 1;
        }
      });

      const chartData = Object.entries(optionCounts).map(([name, value]) => ({
        name,
        value,
        percent: answers.length > 0 ? Math.round((value / answers.length) * 100) : 0
      }));

      return {
        question,
        type: question.type,
        chartData,
        totalAnswers: answers.length
      };
    });
  }, [survey]);

  const respondedParents = useMemo(() => {
    return survey.responses.map(response => {
      const parent = users.find(u => u.id === response.parentId);
      const student = parent?.studentIds?.[0] ? getStudentById(parent.studentIds[0]) : undefined;
      return { response, parent, student };
    }).filter(r => r.parent);
  }, [survey.responses, users, getStudentById]);

  const unrespondedParents = useMemo(() => {
    const respondedIds = new Set(survey.responses.map(r => r.parentId));
    return users.filter(u =>
      u.role === 'parent' && !respondedIds.has(u.id)
    ).map(parent => {
      const student = parent.studentIds?.[0] ? getStudentById(parent.studentIds[0]) : undefined;
      return { parent, student };
    });
  }, [survey.responses, users, getStudentById]);

  const handleExport = () => {
    const csvContent = [
      ['家长', '学生', '提交时间', ...survey.questions.map(q => q.title)].join(','),
      ...respondedParents.map(({ response, parent, student }) => [
        parent?.name || '',
        student?.name || '',
        formatDateTime(response.submittedAt),
        ...survey.questions.map(q => {
          const answer = response.answers.find(a => a.questionId === q.id)?.value;
          if (Array.isArray(answer)) return `"${answer.join('; ')}"`;
          return answer || '';
        })
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${survey.title}_统计结果.csv`;
    link.click();
  };

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={!expired ? 'success' : 'default'} size="sm">
                    {!expired ? '进行中' : '已结束'}
                  </Badge>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{survey.title}</h1>
                <p className="text-sm text-gray-500">{survey.description}</p>
              </div>
              {currentUser?.role === 'teacher' && (
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  导出CSV
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  回复人数
                </div>
                <p className="text-2xl font-bold text-blue-700">{responseCount} / {totalParents}</p>
                <p className="text-xs text-blue-500 mt-1">回复率 {responsePercent}%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />
                  问题数量
                </div>
                <p className="text-2xl font-bold text-green-700">{survey.questions.length}</p>
                <p className="text-xs text-green-500 mt-1">
                  {survey.questions.filter(q => q.required).length} 道必填
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  发布时间
                </div>
                <p className="text-lg font-bold text-purple-700">{formatDate(survey.createdAt)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  截止时间
                </div>
                <p className="text-lg font-bold text-orange-700">{formatDate(survey.deadline)}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            统计汇总
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'responses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            回复详情 ({responseCount})
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-6">
            {questionStats.map((stat, qIndex) => (
              <Card key={stat.question.id}>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-6">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{stat.question.title}</span>
                        {stat.question.required && (
                          <Badge variant="danger" size="sm">必填</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {QUESTION_TYPE_LABELS[stat.question.type]} · {stat.type !== 'text' ? `${stat.totalAnswers} 人作答` : `${stat.answers.length} 条回答`}
                      </p>
                    </div>
                  </div>

                  {stat.type !== 'text' ? (
                    <div className="ml-11">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-64">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            柱状图
                          </h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stat.chartData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="h-64">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <PieChart className="w-4 h-4" />
                            饼图
                          </h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={stat.chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${percent}%`}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {stat.chartData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RePieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {stat.chartData.map((item, index) => (
                          <div
                            key={item.name}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-sm text-gray-600 truncate">{item.name}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-gray-900">{item.value}</span>
                              <span className="text-xs text-gray-400">人 ({item.percent}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="ml-11 space-y-2">
                      {stat.answers.length > 0 ? (
                        stat.answers.map((answer, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-gray-400 text-sm">
                          暂无文本回答
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {responseCount > 0 ? (
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">已回复 ({responseCount})</h3>
                  <div className="space-y-3">
                    {respondedParents.map(({ response, parent, student }) => (
                      <div
                        key={response.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <Avatar
                          src={parent?.avatar}
                          name={parent?.name}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{parent?.name}</span>
                            {student && (
                              <Badge variant="info" size="sm">{student.name}家长</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            提交于 {formatDateTime(response.submittedAt)}
                          </p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <Empty
                icon={Users}
                title="暂无回复"
                description="还没有家长回复此问卷"
              />
            )}

            {unrespondedParents.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">未回复 ({unrespondedParents.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unrespondedParents.map(({ parent, student }) => (
                      <div
                        key={parent.id}
                        className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100"
                      >
                        <Avatar
                          src={parent.avatar}
                          name={parent.name}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{parent.name}</p>
                          {student && (
                            <p className="text-xs text-gray-500">{student.name}家长</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SurveyResults;
