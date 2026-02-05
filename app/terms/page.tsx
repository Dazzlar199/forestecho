'use client'

import { useLanguage } from '@/components/layout/LanguageProvider'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsOfService() {
  const { language } = useLanguage()
  const router = useRouter()

  const content = {
    ko: {
      title: '이용약관',
      lastUpdated: '최종 수정일: 2026년 1월 30일',
      sections: [
        {
          title: '제1조 (목적)',
          content: `본 약관은 숲울림(이하 "회사")이 제공하는 AI 심리상담 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`
        },
        {
          title: '제2조 (정의)',
          content: `1. "서비스"란 회사가 제공하는 AI 기반 심리상담, 감정 기록, 자가진단, 정신건강 교육 등의 모든 서비스를 의미합니다.
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.
3. "회원"이란 회사와 서비스 이용계약을 체결하고 회원 ID를 부여받은 자를 의미합니다.
4. "AI 상담사"란 인공지능(AI) 기술을 활용하여 심리상담 서비스를 제공하는 시스템을 의미합니다.
5. "프리미엄 서비스"란 유료로 제공되는 추가 기능 및 혜택을 의미합니다.`
        },
        {
          title: '제3조 (약관의 효력 및 변경)',
          content: `1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경사항을 시행일자 7일 전부터 공지합니다.
3. 이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.`
        },
        {
          title: '제4조 (서비스의 제공)',
          content: `1. 회사는 다음과 같은 서비스를 제공합니다:
   • AI 기반 심리상담 (24시간 이용 가능)
   • 감정 기록 및 분석
   • 우울증, 불안장애 등 자가진단 도구
   • 정신건강 관련 교육 콘텐츠
   • 심리 분석 리포트 (프리미엄)
   • 기타 회사가 추가 개발하거나 제휴계약을 통해 제공하는 서비스

2. 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검, 서버 증설, 기술적 문제 등으로 일시적인 중단이 발생할 수 있습니다.

3. 회사는 서비스의 품질 향상을 위해 서비스의 내용을 변경하거나 추가할 수 있습니다.`
        },
        {
          title: '제5조 (서비스의 제한 및 중단)',
          content: `1. 회사는 다음 각 호의 경우 서비스 제공을 제한하거나 중단할 수 있습니다:
   • 서비스용 설비의 보수, 점검, 교체 시
   • 전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중단했을 때
   • 국가비상사태, 정전, 서비스 설비의 장애 등 불가항력적 사유가 있는 경우
   • 서비스 이용의 폭주 등으로 정상적인 서비스 제공이 어려운 경우

2. 회사는 서비스를 중단하는 경우 사전에 공지합니다. 다만, 긴급한 경우 사후에 공지할 수 있습니다.`
        },
        {
          title: '제6조 (회원가입 및 계정)',
          content: `1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.

2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
   • 등록 내용에 허위, 기재누락, 오기가 있는 경우
   • 만 19세 미만인 경우 (단, 보호자 동의 시 예외)
   • 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우

3. 회원은 등록사항에 변경이 있는 경우, 즉시 회사에 알려야 합니다.`
        },
        {
          title: '제7조 (회원 탈퇴 및 자격 상실)',
          content: `1. 회원은 언제든지 서비스 내 '회원탈퇴' 메뉴를 통해 이용계약 해지를 요청할 수 있으며, 회사는 관련 법령이 정하는 바에 따라 이를 즉시 처리합니다.

2. 회사는 다음 각 호의 경우 회원 자격을 제한하거나 정지시킬 수 있습니다:
   • 가입 신청 시 허위 내용을 등록한 경우
   • 다른 사람의 서비스 이용을 방해하거나 정보를 도용하는 등 전자거래질서를 위협하는 경우
   • 서비스를 이용하여 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
   • AI 시스템을 악용하거나 과도하게 사용하여 서비스 운영에 지장을 주는 경우

3. 회사가 회원 자격을 제한·정지시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 회사는 회원자격을 상실시킬 수 있습니다.`
        },
        {
          title: '제8조 (회원의 의무)',
          content: `1. 회원은 다음 행위를 하여서는 안 됩니다:
   • 신청 또는 변경 시 허위 내용의 등록
   • 타인의 정보 도용
   • 회사가 게시한 정보의 무단 변경
   • 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
   • 회사의 저작권, 제3자의 저작권 등 지적재산권에 대한 침해
   • 회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위
   • 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
   • AI 시스템의 취약점을 악용하거나 비정상적인 방법으로 서비스를 이용하는 행위
   • 자살, 자해를 조장하거나 타인에게 해를 끼칠 목적으로 서비스를 이용하는 행위

2. 회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 합니다.`
        },
        {
          title: '제9조 (서비스의 특성 및 한계)',
          content: `1. 본 서비스는 AI 기술을 활용한 심리상담 서비스이며, 의료법상 의료행위가 아닙니다.

2. AI 상담사는 전문 의료인이 아니며, 제공되는 정보는 일반적인 심리적 지원 및 교육 목적으로만 사용되어야 합니다.

3. 서비스는 진단, 처방, 치료를 제공하지 않으며, 이용자는 심각한 정신건강 문제나 응급 상황 시 반드시 전문 의료기관을 방문하거나 긴급 연락처로 연락해야 합니다.

4. AI 상담사의 응답은 완벽하지 않을 수 있으며, 이용자는 이를 참고 자료로만 활용해야 합니다.

5. 회사는 서비스를 통해 제공되는 정보의 정확성, 완전성, 신뢰성에 대해 보증하지 않습니다.`
        },
        {
          title: '제10조 (개인정보보호)',
          content: `1. 회사는 이용자의 개인정보를 보호하기 위해 「개인정보보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.

2. 회사의 개인정보 처리방침은 별도로 공지되며, 서비스 내에서 확인할 수 있습니다.

3. 회사는 이용자의 대화 내용을 암호화하여 저장하며, 법령에 의하거나 이용자의 동의가 있는 경우를 제외하고 제3자에게 제공하지 않습니다.`
        },
        {
          title: '제11조 (유료 서비스)',
          content: `1. 회사는 기본 무료 서비스 외에 프리미엄 유료 서비스를 제공할 수 있습니다.

2. 유료 서비스의 이용요금, 결제방법, 환불규정 등은 별도로 공지되며, 이용자는 이에 동의한 후 유료 서비스를 이용할 수 있습니다.

3. 유료 서비스의 환불은 「전자상거래 등에서의 소비자보호에 관한 법률」 등 관련 법령이 정하는 바에 따릅니다.

4. 회원의 귀책사유로 서비스를 이용하지 못한 경우에는 환불되지 않습니다.`
        },
        {
          title: '제12조 (저작권 및 지적재산권)',
          content: `1. 서비스에서 제공되는 콘텐츠(텍스트, 이미지, 오디오, 비디오 등)의 저작권 및 지적재산권은 회사에 귀속됩니다.

2. 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 할 수 없습니다.

3. 이용자가 작성한 게시물(커뮤니티 등)에 대한 권리는 이용자에게 있으나, 회사는 서비스 운영, 개선, 홍보 등의 목적으로 이를 사용할 수 있습니다.`
        },
        {
          title: '제13조 (면책사항)',
          content: `1. 회사는 천재지변, 전쟁, 파업, 정부의 명령, 기타 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.

2. 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.

3. 회사는 이용자가 서비스를 이용하여 기대하는 효과나 결과를 얻지 못한 것에 대해 책임을 지지 않습니다.

4. 회사는 이용자가 서비스를 통해 얻은 정보를 신뢰하여 취한 조치로 인한 손해에 대해 책임을 지지 않습니다.

5. 회사는 이용자 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임을 지지 않습니다.`
        },
        {
          title: '제14조 (손해배상)',
          content: `1. 회사는 서비스 제공과 관련하여 회사의 고의 또는 중대한 과실로 인해 이용자에게 손해가 발생한 경우 책임을 집니다.

2. 이용자가 본 약관을 위반하여 회사에 손해가 발생한 경우, 이용자는 회사에 발생한 모든 손해를 배상해야 합니다.`
        },
        {
          title: '제15조 (분쟁해결)',
          content: `1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 고객지원팀을 운영합니다.

2. 회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보합니다.

3. 회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.`
        },
        {
          title: '제16조 (재판권 및 준거법)',
          content: `1. 이 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국의 법령을 적용합니다.

2. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.`
        },
        {
          title: '부칙',
          content: `본 약관은 2026년 1월 30일부터 적용됩니다.`
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: January 30, 2026',
      sections: [
        {
          title: 'Article 1 (Purpose)',
          content: `These Terms of Service ("Terms") are designed to define the rights, obligations, responsibilities, and other necessary matters between ForestEcho ("Company") and users regarding the use of the AI psychological counseling service ("Service").`
        },
        {
          title: 'Article 2 (Definitions)',
          content: `1. "Service" means all services provided by the Company, including AI-based psychological counseling, emotion tracking, self-assessment, and mental health education.
2. "User" means any person who uses the Service in accordance with these Terms.
3. "Member" means a person who has entered into a service use agreement with the Company and has been assigned a member ID.
4. "AI Counselor" means a system that provides psychological counseling services using artificial intelligence (AI) technology.
5. "Premium Service" means additional features and benefits provided for a fee.`
        },
        {
          title: 'Article 3 (Effectiveness and Amendment of Terms)',
          content: `1. These Terms become effective when posted on the Service screen or otherwise announced.
2. The Company may amend these Terms as necessary within the limits of applicable laws. When the Terms are amended, the changes will be announced at least 7 days before the effective date.
3. If a user does not agree to the amended Terms, they may discontinue use of the Service and terminate the service agreement.`
        },
        {
          title: 'Article 4 (Provision of Service)',
          content: `1. The Company provides the following services:
   • AI-based psychological counseling (available 24/7)
   • Emotion tracking and analysis
   • Self-assessment tools for depression, anxiety disorders, etc.
   • Mental health education content
   • Psychological analysis reports (Premium)
   • Other services developed by the Company or provided through partnerships

2. The Service is provided 24 hours a day, 365 days a year in principle. However, temporary interruptions may occur due to system maintenance, server expansion, technical issues, etc.

3. The Company may change or add service content to improve service quality.`
        },
        {
          title: 'Article 5 (Limitation and Suspension of Service)',
          content: `1. The Company may limit or suspend Service provision in the following cases:
   • Maintenance, inspection, or replacement of service facilities
   • When a telecommunications carrier ceases telecommunications services
   • In cases of force majeure such as national emergencies, power outages, or service facility failures
   • When normal service provision is difficult due to service congestion

2. The Company will announce service suspension in advance. However, in urgent cases, it may be announced afterwards.`
        },
        {
          title: 'Article 6 (Membership Registration and Account)',
          content: `1. Users apply for membership by filling out the registration form provided by the Company and indicating their agreement to these Terms.

2. The Company will register users who apply for membership under paragraph 1 as members unless any of the following applies:
   • False information, omissions, or errors in registration
   • Under 19 years of age (except with parental consent)
   • Registering as a member would cause significant technical difficulties for the Company

3. Members must immediately notify the Company of any changes to their registration information.`
        },
        {
          title: 'Article 7 (Member Withdrawal and Loss of Qualification)',
          content: `1. Members may request termination of the service agreement at any time through the 'Withdraw Membership' menu in the Service, and the Company will process this immediately in accordance with applicable laws.

2. The Company may limit or suspend member qualifications in the following cases:
   • Registering false information during signup
   • Interfering with others' use of the Service or stealing information
   • Using the Service to engage in acts prohibited by law or these Terms
   • Abusing the AI system or using it excessively, disrupting service operations

3. If the same behavior occurs more than twice after the Company limits or suspends member qualifications, or if the cause is not corrected within 30 days, the Company may revoke member qualifications.`
        },
        {
          title: 'Article 8 (Member Obligations)',
          content: `1. Members must not:
   • Register false information during application or modification
   • Steal others' information
   • Unauthorized alteration of information posted by the Company
   • Send or post information other than that designated by the Company
   • Infringe on the Company's copyright or third-party intellectual property rights
   • Damage the reputation of the Company or third parties or interfere with their business
   • Post obscene or violent messages, images, audio, or other information contrary to public order
   • Exploit vulnerabilities in the AI system or use the Service abnormally
   • Use the Service to encourage suicide or self-harm, or to harm others

2. Members must comply with applicable laws, these Terms, usage guidelines, notices regarding the Service, and matters notified by the Company.`
        },
        {
          title: 'Article 9 (Service Characteristics and Limitations)',
          content: `1. This Service is an AI-based psychological counseling service and is not a medical practice under medical law.

2. AI counselors are not professional medical personnel, and the information provided should only be used for general psychological support and educational purposes.

3. The Service does not provide diagnosis, prescription, or treatment, and users must visit professional medical institutions or contact emergency numbers in case of serious mental health issues or emergencies.

4. AI counselor responses may not be perfect, and users should use them only as reference material.

5. The Company does not guarantee the accuracy, completeness, or reliability of information provided through the Service.`
        },
        {
          title: 'Article 10 (Privacy Protection)',
          content: `1. The Company complies with applicable laws including the Personal Information Protection Act and the Act on Promotion of Information and Communications Network Utilization and Information Protection to protect users' personal information.

2. The Company's privacy policy is separately announced and can be found within the Service.

3. The Company encrypts and stores users' conversation content and does not provide it to third parties except as required by law or with user consent.`
        },
        {
          title: 'Article 11 (Paid Services)',
          content: `1. In addition to the basic free service, the Company may provide premium paid services.

2. The fee, payment method, and refund policy for paid services are separately announced, and users can use paid services after agreeing to these terms.

3. Refunds for paid services follow the Consumer Protection Act in Electronic Commerce and other applicable laws.

4. If a member is unable to use the Service due to reasons attributable to the member, no refund will be provided.`
        },
        {
          title: 'Article 12 (Copyright and Intellectual Property)',
          content: `1. Copyright and intellectual property rights for content provided in the Service (text, images, audio, video, etc.) belong to the Company.

2. Users may not reproduce, transmit, publish, distribute, broadcast, or otherwise use for commercial purposes or allow third parties to use information obtained through the Service without the Company's prior consent.

3. Rights to posts created by users (such as in communities) belong to the users, but the Company may use them for service operation, improvement, and promotion purposes.`
        },
        {
          title: 'Article 13 (Disclaimer)',
          content: `1. The Company is exempt from liability if it cannot provide the Service due to force majeure such as natural disasters, war, strikes, government orders, or other unavoidable circumstances.

2. The Company is not responsible for service disruptions caused by reasons attributable to users.

3. The Company is not responsible for users not achieving expected effects or results through using the Service.

4. The Company is not responsible for damages resulting from actions taken in reliance on information obtained through the Service.

5. The Company has no obligation to intervene in disputes between users or between users and third parties mediated by the Service, and is not responsible for damages resulting from such disputes.`
        },
        {
          title: 'Article 14 (Damages)',
          content: `1. The Company is responsible if damages occur to users due to the Company's willful misconduct or gross negligence in relation to providing the Service.

2. If a user violates these Terms and causes damages to the Company, the user must compensate the Company for all damages incurred.`
        },
        {
          title: 'Article 15 (Dispute Resolution)',
          content: `1. The Company operates a customer support team to reflect legitimate opinions and complaints raised by users and to compensate for damages.

2. The Company prioritizes processing complaints and opinions submitted by users. However, if prompt processing is difficult, the Company will immediately notify users of the reason and processing schedule.

3. If there is a request for damage relief regarding electronic commerce disputes between the Company and users, mediation by a dispute resolution body commissioned by the Fair Trade Commission or city/provincial governors may be followed.`
        },
        {
          title: 'Article 16 (Jurisdiction and Governing Law)',
          content: `1. Korean law applies to the interpretation of these Terms and disputes between the Company and users.

2. If a lawsuit is filed regarding disputes arising from using the Service, the court with jurisdiction over the Company's headquarters location shall have exclusive jurisdiction.`
        },
        {
          title: 'Supplementary Provisions',
          content: `These Terms apply from January 30, 2026.`
        }
      ]
    }
  }

  const currentContent = language === 'en' ? content.en : content.ko

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-sky-50/50 to-amber-50/30 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>돌아가기</span>
        </button>

        {/* 제목 */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            {currentContent.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {currentContent.lastUpdated}
          </p>
        </div>

        {/* 내용 */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 space-y-8">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            {language === 'en'
              ? 'If you have any questions about the Terms of Service, please contact our customer support.'
              : '이용약관에 대한 문의사항이 있으시면 고객지원팀으로 연락주시기 바랍니다.'}
          </p>
        </div>
      </div>
    </div>
  )
}
