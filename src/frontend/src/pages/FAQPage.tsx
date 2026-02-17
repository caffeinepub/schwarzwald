import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '../contexts/LanguageContext';

export default function FAQPage() {
  const { t } = useLanguage();

  const faqSections = [
    {
      title: t('faq.booking.title'),
      questions: [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
      ],
    },
    {
      title: t('faq.arrival.title'),
      questions: [
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
      ],
    },
    {
      title: t('faq.amenities.title'),
      questions: [
        { q: t('faq.q6'), a: t('faq.a6') },
        { q: t('faq.q7'), a: t('faq.a7') },
        { q: t('faq.q8'), a: t('faq.a8') },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t('faq.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 mt-8 md:mt-0 first:mt-0">
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-4 md:space-y-5">
                {section.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${sectionIndex}-${index}`}
                    className="premium-faq-box border-[1px] border-black rounded-lg bg-white overflow-hidden"
                    style={{ borderColor: '#000000', borderWidth: '1px', borderRadius: '8px' }}
                  >
                    <AccordionTrigger 
                      className="premium-faq-trigger text-left font-medium hover:no-underline px-5 py-4 md:px-6 md:py-5 [&[data-state=open]>svg]:rotate-180"
                      style={{ border: 'none' }}
                    >
                      <span className="pr-4">{item.q}</span>
                    </AccordionTrigger>
                    <AccordionContent 
                      className="premium-faq-content text-muted-foreground px-5 pb-4 pt-1 md:px-6 md:pb-5 md:pt-2"
                      style={{ border: 'none' }}
                    >
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
