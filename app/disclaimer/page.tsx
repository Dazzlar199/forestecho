'use client'

import { useLanguage } from '@/components/layout/LanguageProvider'
import { ArrowLeft, AlertTriangle, Phone, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Disclaimer() {
  const { language } = useLanguage()
  const router = useRouter()

  const content = {
    ko: {
      title: '법적 고지사항 및 면책 조항',
      subtitle: '서비스 이용 전 반드시 읽어주세요',
      lastUpdated: '최종 수정일: 2026년 1월 30일',
      sections: [
        {
          icon: <AlertTriangle className="text-amber-500" size={32} />,
          title: '1. 의료 행위가 아닙니다',
          content: `숲울림(ForestEcho) 서비스는 **인공지능(AI) 기술을 활용한 일반적인 심리적 지원 및 교육 서비스**입니다.

• 본 서비스는 의료법상 의료행위가 아닙니다.
• AI 상담사는 의사, 임상심리사, 상담심리사 등 전문 의료인이 아닙니다.
• 본 서비스는 정신건강의학과, 심리상담센터 등 전문 의료기관의 진료를 대체할 수 없습니다.
• 어떠한 경우에도 본 서비스를 의학적 진단, 처방, 치료의 근거로 사용해서는 안 됩니다.`
        },
        {
          icon: <ShieldAlert className="text-red-500" size={32} />,
          title: '2. AI 상담의 한계',
          content: `AI 기술은 지속적으로 발전하고 있지만, 여전히 다음과 같은 한계가 있습니다:

• **완벽하지 않음**: AI의 응답은 오류를 포함할 수 있으며, 항상 정확하거나 적절하지 않을 수 있습니다.
• **맥락 이해 한계**: 복잡한 감정이나 상황을 완전히 이해하지 못할 수 있습니다.
• **개인별 차이**: 모든 사람에게 동일한 조언이 효과적이지 않을 수 있습니다.
• **응급 상황 대응 불가**: AI는 즉각적인 위기 개입이나 응급 상황에 대응할 수 없습니다.
• **인간 상담사 대체 불가**: AI는 인간 상담사의 공감, 직관, 전문적 판단을 대체할 수 없습니다.

따라서 본 서비스의 응답은 **참고 자료**로만 활용하시고, 중요한 결정을 내리기 전에는 반드시 전문가와 상담하시기 바랍니다.`
        },
        {
          icon: <Phone className="text-blue-500" size={32} />,
          title: '3. 응급 상황 시 즉시 전문기관에 연락하세요',
          content: `다음과 같은 상황에서는 **즉시 본 서비스 이용을 중단**하고 아래 긴급 연락처로 연락하거나 가까운 의료기관을 방문하세요:

**즉시 도움이 필요한 경우:**
• 자살이나 자해를 생각하거나 계획하고 있는 경우
• 타인에게 해를 끼칠 위험이 있는 경우
• 심각한 정신증적 증상 (환청, 환각, 망상 등)
• 급성 불안 발작, 공황 발작
• 약물 또는 알코올 과다 섭취
• 기타 생명을 위협하는 응급 상황

**긴급 연락처:**
🚨 **자살예방 상담전화**: 1393 (24시간)
🚨 **정신건강 위기상담**: 1577-0199 (24시간)
🚨 **생명의 전화**: 1588-9191
🚨 **희망의 전화**: 129
🚨 **청소년 전화**: 1388

**본 서비스는 응급 상황에 대응할 수 없으며, 위기 상황에서는 반드시 위 전문기관의 도움을 받으시기 바랍니다.**`
        },
        {
          title: '4. 정보의 정확성 및 완전성 보장 불가',
          content: `• 본 서비스를 통해 제공되는 모든 정보는 일반적인 교육 및 참고 목적으로만 제공됩니다.
• 회사는 서비스를 통해 제공되는 정보의 정확성, 완전성, 신뢰성, 적시성을 보장하지 않습니다.
• AI 모델은 지속적으로 업데이트되며, 응답의 품질이나 내용이 변경될 수 있습니다.
• 제공되는 정보는 최신 심리학 연구를 참고하지만, 모든 최신 연구 결과를 반영하지 못할 수 있습니다.`
        },
        {
          title: '5. 이용 결과에 대한 책임',
          content: `• **이용자 책임**: 본 서비스를 이용하여 얻은 정보를 신뢰하거나 이에 근거하여 취한 모든 조치는 전적으로 이용자 본인의 책임입니다.
• **결과 보장 불가**: 회사는 서비스 이용으로 인한 특정 결과(증상 개선, 문제 해결 등)를 보장하지 않습니다.
• **간접 손해 면책**: 회사는 서비스 이용으로 인한 직접, 간접, 특별, 우발적, 결과적 손해에 대해 책임을 지지 않습니다.
• **정보 오류**: AI 응답의 오류나 부정확한 정보로 인한 손해에 대해 회사는 책임을 지지 않습니다.`
        },
        {
          title: '6. 개인정보 및 대화 내용',
          content: `• 본 서비스는 이용자의 대화 내용을 암호화하여 저장합니다.
• 대화 내용은 서비스 개선 및 AI 모델 학습에 익명화되어 사용될 수 있습니다.
• 민감한 개인정보나 타인의 정보를 대화에 포함하지 마시기 바랍니다.
• 상세한 개인정보 처리 방침은 별도의 "개인정보처리방침"을 참조하세요.`
        },
        {
          title: '7. 미성년자 이용 시 주의사항',
          content: `• 만 19세 미만 미성년자는 보호자의 동의를 받은 후 서비스를 이용하는 것을 권장합니다.
• 보호자는 미성년자의 서비스 이용을 모니터링하고 적절히 지도해야 합니다.
• 미성년자가 심각한 정신건강 문제를 보이는 경우, 반드시 전문 의료기관의 진료를 받도록 해주세요.
• 청소년 상담이 필요한 경우: **청소년 전화 1388** (24시간)`
        },
        {
          title: '8. 서비스 중단 및 변경',
          content: `• 회사는 시스템 점검, 기술적 문제, 정책 변경 등의 이유로 서비스를 일시적으로 중단하거나 내용을 변경할 수 있습니다.
• 서비스 중단이나 변경으로 인한 불편이나 손해에 대해 회사는 책임을 지지 않습니다.
• 중요한 변경 사항은 사전에 공지하도록 노력하겠습니다.`
        },
        {
          title: '9. 제3자 콘텐츠 및 링크',
          content: `• 본 서비스는 외부 웹사이트나 제3자 콘텐츠로 연결되는 링크를 포함할 수 있습니다.
• 회사는 제3자 웹사이트나 콘텐츠의 정확성, 신뢰성, 합법성에 대해 책임을 지지 않습니다.
• 외부 링크를 통한 서비스 이용은 해당 웹사이트의 이용약관 및 정책이 적용됩니다.`
        },
        {
          title: '10. 법적 효력',
          content: `• 본 면책 조항은 서비스 이용약관의 일부를 구성합니다.
• 본 면책 조항의 일부가 법적으로 무효이거나 집행 불가능한 것으로 판단되더라도, 나머지 조항은 계속 유효합니다.
• 본 면책 조항과 이용약관 간에 충돌이 있는 경우, 구체적인 내용이 우선 적용됩니다.
• 본 면책 조항은 대한민국 법령에 따라 해석되며, 관련 분쟁은 회사의 본사 소재지 관할 법원에서 해결합니다.`
        }
      ],
      agreement: {
        title: '동의 및 확인',
        content: `본 서비스를 이용함으로써 귀하는:

✓ 본 면책 조항의 모든 내용을 읽고 이해했음을 확인합니다.
✓ 본 서비스가 의료 행위가 아니며 전문 의료 서비스를 대체할 수 없음을 인정합니다.
✓ AI 상담의 한계를 이해하고 응답을 참고 자료로만 활용할 것에 동의합니다.
✓ 응급 상황 시 본 서비스 대신 전문 기관의 도움을 받을 것에 동의합니다.
✓ 서비스 이용 결과에 대한 책임이 본인에게 있음을 인정합니다.

**본 내용에 동의하지 않는 경우, 서비스 이용을 중단하시기 바랍니다.**`
      }
    },
    en: {
      title: 'Legal Notice and Disclaimer',
      subtitle: 'Please read carefully before using the service',
      lastUpdated: 'Last Updated: January 30, 2026',
      sections: [
        {
          icon: <AlertTriangle className="text-amber-500" size={32} />,
          title: '1. Not a Medical Service',
          content: `ForestEcho is a **general psychological support and educational service using artificial intelligence (AI) technology**.

• This service is not a medical practice under medical law.
• AI counselors are not licensed medical professionals such as doctors, clinical psychologists, or counseling psychologists.
• This service cannot replace professional medical institutions such as psychiatric clinics or counseling centers.
• Under no circumstances should this service be used as a basis for medical diagnosis, prescription, or treatment.`
        },
        {
          icon: <ShieldAlert className="text-red-500" size={32} />,
          title: '2. Limitations of AI Counseling',
          content: `While AI technology continues to evolve, it still has the following limitations:

• **Not Perfect**: AI responses may contain errors and may not always be accurate or appropriate.
• **Context Understanding Limits**: May not fully understand complex emotions or situations.
• **Individual Differences**: The same advice may not be effective for everyone.
• **Cannot Handle Emergencies**: AI cannot respond to immediate crisis intervention or emergency situations.
• **Cannot Replace Human Counselors**: AI cannot replace human counselors' empathy, intuition, and professional judgment.

Therefore, please use responses from this service only as **reference material**, and be sure to consult with professionals before making important decisions.`
        },
        {
          icon: <Phone className="text-blue-500" size={32} />,
          title: '3. Contact Professional Institutions Immediately in Emergencies',
          content: `In the following situations, **immediately stop using this service** and contact the emergency numbers below or visit a nearby medical facility:

**When Immediate Help is Needed:**
• Thinking about or planning suicide or self-harm
• Risk of harming others
• Severe psychotic symptoms (auditory/visual hallucinations, delusions)
• Acute anxiety or panic attacks
• Drug or alcohol overdose
• Other life-threatening emergencies

**Emergency Contacts:**
🚨 **Suicide Prevention Hotline**: 1393 (24/7)
🚨 **Mental Health Crisis Counseling**: 1577-0199 (24/7)
🚨 **Lifeline**: 1588-9191
🚨 **Hope Line**: 129
🚨 **Youth Hotline**: 1388

**This service cannot respond to emergency situations. In crisis situations, please seek help from professional institutions above.**`
        },
        {
          title: '4. No Guarantee of Information Accuracy or Completeness',
          content: `• All information provided through this service is for general educational and reference purposes only.
• The Company does not guarantee the accuracy, completeness, reliability, or timeliness of information provided through the service.
• AI models are continuously updated, and the quality or content of responses may change.
• While the information provided references current psychology research, it may not reflect all the latest research findings.`
        },
        {
          title: '5. Responsibility for Use Results',
          content: `• **User Responsibility**: All actions taken based on or in reliance on information obtained through this service are entirely the user's own responsibility.
• **No Results Guarantee**: The Company does not guarantee specific results (symptom improvement, problem resolution, etc.) from using the service.
• **Indirect Damages Disclaimer**: The Company is not liable for direct, indirect, special, incidental, or consequential damages resulting from using the service.
• **Information Errors**: The Company is not liable for damages caused by errors or inaccurate information in AI responses.`
        },
        {
          title: '6. Personal Information and Conversation Content',
          content: `• This service encrypts and stores users' conversation content.
• Conversation content may be anonymized and used for service improvement and AI model training.
• Please do not include sensitive personal information or others' information in conversations.
• For detailed personal information handling policies, please refer to the separate "Privacy Policy."`
        },
        {
          title: '7. Precautions for Minors',
          content: `• Minors under 19 years old are recommended to use the service after obtaining parental consent.
• Parents should monitor and appropriately guide minors' use of the service.
• If minors show serious mental health issues, please ensure they receive professional medical care.
• For youth counseling needs: **Youth Hotline 1388** (24/7)`
        },
        {
          title: '8. Service Interruption and Changes',
          content: `• The Company may temporarily suspend the service or change its content due to system maintenance, technical issues, policy changes, etc.
• The Company is not responsible for inconvenience or damages caused by service interruption or changes.
• We will make efforts to announce important changes in advance.`
        },
        {
          title: '9. Third-Party Content and Links',
          content: `• This service may include links to external websites or third-party content.
• The Company is not responsible for the accuracy, reliability, or legality of third-party websites or content.
• Use of services through external links is subject to the terms and policies of those websites.`
        },
        {
          title: '10. Legal Effect',
          content: `• This disclaimer constitutes part of the service terms of use.
• Even if part of this disclaimer is deemed legally invalid or unenforceable, the remaining provisions remain valid.
• In case of conflict between this disclaimer and the terms of use, the specific content takes precedence.
• This disclaimer is interpreted according to Korean law, and related disputes are resolved in courts with jurisdiction over the Company's headquarters.`
        }
      ],
      agreement: {
        title: 'Agreement and Confirmation',
        content: `By using this service, you:

✓ Confirm that you have read and understood all contents of this disclaimer.
✓ Acknowledge that this service is not a medical practice and cannot replace professional medical services.
✓ Understand the limitations of AI counseling and agree to use responses only as reference material.
✓ Agree to seek help from professional institutions instead of this service in emergency situations.
✓ Acknowledge that you are responsible for the results of using the service.

**If you do not agree to this content, please discontinue use of the service.**`
      }
    }
  }

  const currentContent = language === 'en' ? content.en : content.ko

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/80 via-amber-50/50 to-orange-50/30 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{language === 'en' ? 'Back' : '돌아가기'}</span>
        </button>

        {/* 제목 및 경고 */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                {currentContent.title}
              </h1>
              <p className="text-lg text-red-600 dark:text-red-400 font-semibold">
                {currentContent.subtitle}
              </p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">
            {currentContent.lastUpdated}
          </p>
        </div>

        {/* 내용 */}
        <div className="space-y-6">
          {currentContent.sections.map((section, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8"
            >
              {section.icon && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {section.title}
                  </h2>
                </div>
              )}
              {!section.icon && (
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                  {section.title}
                </h2>
              )}
              <div className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}

          {/* 동의 및 확인 */}
          <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              {currentContent.agreement.title}
            </h2>
            <div className="whitespace-pre-line leading-relaxed">
              {currentContent.agreement.content}
            </div>
          </div>
        </div>

        {/* 하단 연락처 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {language === 'en' ? 'Emergency Contacts' : '긴급 연락처'}
            </h3>
          </div>
          <div className="text-slate-600 dark:text-slate-300 space-y-1">
            <p>🚨 {language === 'en' ? 'Suicide Prevention Hotline' : '자살예방 상담전화'}: <strong>1393</strong></p>
            <p>🚨 {language === 'en' ? 'Mental Health Crisis' : '정신건강 위기상담'}: <strong>1577-0199</strong></p>
            <p>🚨 {language === 'en' ? 'Lifeline' : '생명의 전화'}: <strong>1588-9191</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
