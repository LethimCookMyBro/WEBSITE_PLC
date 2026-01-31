export const dictionary = {
  en: {
    // Navigation
    nav_product: "Product",
    nav_how_it_works: "How It Works",
    nav_prototype: "Prototype",
    nav_results: "Results",
    nav_pricing: "Pricing",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    nav_cta: "Book a Demo",

    // Hero
    hero_badge_cited: "Cited Answers",
    hero_badge_speed: "~4s Avg Response",
    hero_badge_escalate: "Escalate to Expert",
    hero_title: "Reduce PLC downtime with fast, cited troubleshooting answers.",
    hero_subtitle:
      "PANYA is an intelligent RAG-based assistant that retrieves answers directly from PLC manuals and technical documentation. Get step-by-step guidance with source citations, and escalate to human experts when needed.",
    hero_cta_primary: "Try Prototype",
    hero_cta_secondary: "Book a Demo",
    hero_card_title: "PANYA Assistant",
    hero_chat_user: "Mitsubishi FX5U error 2401 - how to fix?",
    hero_chat_ai:
      "Error 2401 indicates parameter access failure. Follow these steps: 1) Check parameter settings in GX Works3, 2) Verify memory card status, 3) Reset parameters if corrupted.",
    hero_citation: "FX5U User Manual, p.245",

    // Problem Section
    problem_label: "The Challenge",
    problem_title: "PLC Downtime is Costly",
    problem_card1_title: "Expensive Downtime",
    problem_card1_text:
      "Every minute of production line stoppage costs thousands. Finding the right solution quickly is critical.",
    problem_card2_title: "Complex Troubleshooting",
    problem_card2_text:
      "PLC manuals are extensive. Technicians spend valuable time searching for the right information under pressure.",
    problem_card3_title: "Expert Availability",
    problem_card3_text:
      "Senior engineers are often unavailable, leaving junior staff struggling with critical issues.",

    // Product Section
    product_label: "The Solution",
    product_title: "Meet PANYA",
    product_subtitle:
      "Your intelligent technical support assistant powered by Retrieval-Augmented Generation",
    feature1_title: "Document-Grounded Answers",
    feature1_text:
      "Answers are retrieved and generated from curated PLC manuals and technical documentation, not hallucinated.",
    feature2_title: "Citations & Traceability",
    feature2_text:
      "Every answer includes source citations with page numbers and document references for verification.",
    feature3_title: "Error Code & Troubleshooting",
    feature3_text:
      "Get step-by-step troubleshooting guidance for specific error codes and system symptoms.",
    feature4_title: "Clarifying Questions",
    feature4_text:
      "When information is incomplete, PANYA asks relevant questions to provide accurate assistance.",
    feature5_title: "Escalate to Expert",
    feature5_text:
      "Seamless handoff to human experts via chat or call when confidence is low or risk is high.",
    feature6_title: "Continuous Improvement",
    feature6_text:
      "Expert answers can be verified and added to the knowledge base, improving future responses.",
    why_different_title: "Why PANYA is Different",
    why_different_text:
      "Unlike generic AI chatbots, PANYA combines verified document retrieval with a safety-first approach. Every answer is traceable to source material, and high-risk situations automatically escalate to human experts.",
    why_badge1: "Verified Workflow",
    why_badge2: "Safety-First Design",

    // How It Works
    how_label: "Process",
    how_title: "How PANYA Works",
    step1_title: "Document Indexing",
    step1_text:
      "Curated PLC manuals and technical documentation are processed and indexed for efficient retrieval.",
    step2_title: "Ask Your Question",
    step2_text:
      "Technicians ask questions using error codes, symptoms, or natural language descriptions.",
    step3_title: "Retrieve & Rank",
    step3_text:
      "The system retrieves and ranks the most relevant sections from the knowledge base.",
    step4_title: "Generate Answer",
    step4_text:
      "A step-by-step answer is generated with inline citations linking to source documents.",
    step5_title: "Smart Escalation",
    step5_text:
      "If confidence is low or the issue is high-risk, the system suggests escalating to an expert.",
    step6_title: "Knowledge Verification",
    step6_text:
      "Expert answers can be reviewed and verified, then added to the knowledge base for future queries.",

    // Prototype
    prototype_label: "Preview",
    prototype_title: "See PANYA in Action",
    prototype_subtitle:
      "Experience the prototype interface designed for factory floor technicians",
    proto_chat_user: "Q03UDV CPU error 4100 - what does this mean?",
    proto_chat_ai:
      "Error 4100 indicates an OPERATION ERROR. The operation cannot be processed correctly. Check: 1) Program syntax, 2) Device range, 3) Instruction compatibility.",
    proto_cite1: "QCPU Manual, p.312",
    proto_cite2: "Troubleshooting Guide, p.45",
    proto_escalate: "Escalate",
    proto_mobile_user: "How to reset FX5U?",
    proto_mobile_ai:
      "To reset the FX5U CPU module: 1) Power off the system, 2) Hold the RESET switch for 2+ seconds, 3) Power on while holding RESET.",
    proto_mobile_cite: "FX5U Hardware, p.28",
    proto_feature1: "Inline citations",
    proto_feature2: "Helpful feedback",
    proto_feature3: "One-click escalation",

    // Results
    results_label: "Evaluation",
    results_title: "Measured Performance",
    results_subtitle:
      "Our prototype has been evaluated using industry-standard RAGAs metrics",
    metric_response_label: "Avg Response Time",
    metric_response_note: "Prototype benchmark",
    metric_faith_label: "Faithfulness",
    metric_relevancy_label: "Relevancy",
    metric_precision_label: "Precision",
    metric_recall_label: "Recall",
    evaluation_note:
      "Evaluated using known-answer test questions against curated PLC documentation. Results reflect prototype performance and will improve with continued development.",

    // Pricing - Industrial B2B
    pricing_label: "Pricing Plans",
    pricing_title: "Industrial-Grade Support Plans",
    pricing_subtitle:
      "Scalable solutions for individual technicians to multi-site enterprises",
    price_period: "/month",
    price_custom: "Custom",

    // Plan 1: Maintenance Essentials (Free)
    plan_starter_name: "Free",
    plan_starter_desc: "For individual technicians & quick troubleshooting",
    plan_starter_f1: "Up to 100 queries/month",
    plan_starter_f2: "Mitsubishi PLC support",
    plan_starter_f3: "Standard documentation access",
    plan_starter_f4: "Community forum support",
    plan_cta_start: "Start Free Account",

    // Plan 2: Plan Pro (Paid)
    popular_badge: "Best Value",
    plan_pro_name: "Plan Pro",
    plan_pro_desc: "For plant maintenance teams requiring audit logs",
    plan_pro_f1: "Unlimited queries",
    plan_pro_f2: "Multi-brand (Mitsubishi, Siemens, Allen-Bradley)",
    plan_pro_f3: "Audit logs & detailed citations",
    plan_pro_f4: "Priority expert escalation",
    plan_pro_f5: "Email & Chat support",
    plan_cta_pro: "Start 14-Day Pro Trial",

    // Plan 3: Corporate Suite (Enterprise)
    plan_enterprise_name: "Enterprise",
    plan_enterprise_desc: "For multi-site organizations & security compliance",
    plan_enterprise_f1: "Everything in Plan Pro",
    plan_enterprise_f2: "Private Cloud / On-Premise Deployment",
    plan_enterprise_f3: "Custom knowledge base indexing",
    plan_enterprise_f4: "SSO (Okta/AD) & Role-Based Access",
    plan_enterprise_f5: "Dedicated Key Account Manager",
    plan_enterprise_f6: "Enterprise SLA (99.9% Uptime)",
    plan_cta_enterprise: "Contact Enterprise Sales",

    // FAQ
    faq_label: "FAQ",
    faq_title: "Frequently Asked Questions",
    faq1_question: "How accurate are PANYA's answers?",
    faq1_answer:
      "PANYA uses Retrieval-Augmented Generation (RAG) to ground all answers in verified documentation. Our prototype achieves 79% faithfulness and 89% relevancy on RAGAs benchmarks. Every answer includes citations so you can verify the source material.",
    faq2_question: "What if the manuals don't have the answer?",
    faq2_answer:
      "When documentation is insufficient or confidence is low, PANYA will suggest escalating to a human expert. The escalation system ensures technicians always get reliable help, either from the AI or from experienced engineers.",
    faq3_question: "How is data privacy handled?",
    faq3_answer:
      "The Starter plan uses publicly available PLC documentation. Pro and Enterprise plans can integrate your private knowledge base while keeping all data secure. Enterprise customers receive dedicated infrastructure with full data isolation.",
    faq4_question: "Which PLC brands are supported?",
    faq4_answer:
      "Currently, PANYA supports Mitsubishi, Siemens, and Phoenix Contact PLCs. We are continuously expanding our documentation library. Enterprise customers can request custom PLC support and private document indexing.",
    faq5_question: "Can expert answers improve the system?",
    faq5_answer:
      "Yes. When experts resolve escalated issues, their answers can be reviewed and verified through a Draft → Reviewed → Verified workflow. Verified answers become part of the knowledge base, continuously improving PANYA's capabilities.",

    // Contact - B2B Focus
    contact_label: "Enterprise Solutions",
    contact_title: "Optimize Your Maintenance Operations",
    contact_subtitle:
      "Schedule a consultation with our industrial automation experts.",
    form_name_label: "Full Name",
    form_name_error: "Please enter your full name",
    form_job_label: "Job Title",
    form_job_error: "Please enter your job title",
    form_email_label: "Work Email",
    form_email_error: "Please enter a valid work email",
    form_phone_label: "Phone Number",
    form_phone_error: "Please enter a valid phone number",
    form_company_label: "Company Name",
    form_message_label: "Project Details / Requirements",
    form_message_error: "Please tell us about your requirements",
    form_submit: "Request Consultation",
    form_success_title: "Request Received",
    form_success_text: "Our enterprise team will contact you within 24 hours.",
    contact_email_title: "Enterprise Sales",
    contact_phone_title: "Support Hotline",
    contact_location_title: "Headquarters",
    contact_location_text: "Bangkok, Thailand (APAC Hub)",

    // Footer
    footer_tagline: "Intelligent technical support for industrial automation.",
    footer_links_title: "Product",
    footer_support_title: "Support",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_team_title: "Our Team",
    footer_team_text:
      "Developed by a team of AI researchers and industrial automation experts committed to reducing downtime through intelligent support systems.",
    footer_copyright: "© 2024 PANYA. All rights reserved.",
  },

  th: {
    // Navigation
    nav_product: "ผลิตภัณฑ์",
    nav_how_it_works: "วิธีการทำงาน",
    nav_prototype: "ต้นแบบ",
    nav_results: "ผลลัพธ์",
    nav_pricing: "ราคา",
    nav_faq: "คำถามที่พบบ่อย",
    nav_contact: "ติดต่อ",
    nav_cta: "จองสาธิต",

    // Hero
    hero_badge_cited: "คำตอบมีแหล่งอ้างอิง",
    hero_badge_speed: "ตอบกลับเฉลี่ย ~4 วิ",
    hero_badge_escalate: "ส่งต่อผู้เชี่ยวชาญ",
    hero_title: "Panya",
    hero_subtitle:
      "PANYA คือผู้ช่วยอัจฉริยะที่ใช้เทคโนโลยี RAG ค้นหาคำตอบโดยตรงจากคู่มือ PLC และเอกสารเทคนิค รับคำแนะนำแบบ step-by-step พร้อมแหล่งอ้างอิง และส่งต่อให้ผู้เชี่ยวชาญเมื่อจำเป็น",
    hero_cta_primary: "ลองต้นแบบ",
    hero_cta_secondary: "จองสาธิต",
    hero_card_title: "ผู้ช่วย PANYA",
    hero_chat_user: "Mitsubishi FX5U error 2401 - แก้ไขอย่างไร?",
    hero_chat_ai:
      "Error 2401 บ่งบอกถึงการเข้าถึงพารามิเตอร์ล้มเหลว ทำตามขั้นตอนนี้: 1) ตรวจสอบการตั้งค่าพารามิเตอร์ใน GX Works3, 2) ตรวจสอบสถานะ memory card, 3) รีเซ็ตพารามิเตอร์หากเสียหาย",
    hero_citation: "คู่มือ FX5U, หน้า 245",

    // Problem Section
    problem_label: "ความท้าทาย",
    problem_title: "Downtime ของ PLC มีค่าใช้จ่ายสูง",
    problem_card1_title: "Downtime ที่แพง",
    problem_card1_text:
      "ทุกนาทีที่สายการผลิตหยุดทำงานมีค่าใช้จ่ายหลายพันบาท การหาทางแก้ไขที่รวดเร็วจึงมีความสำคัญ",
    problem_card2_title: "การแก้ปัญหาที่ซับซ้อน",
    problem_card2_text:
      "คู่มือ PLC มีความละเอียดมาก ช่างเทคนิคต้องใช้เวลาอันมีค่าในการค้นหาข้อมูลที่ถูกต้องภายใต้ความกดดัน",
    problem_card3_title: "การเข้าถึงผู้เชี่ยวชาญ",
    problem_card3_text:
      "วิศวกรอาวุโสมักไม่ว่าง ทำให้พนักงานใหม่ต้องดิ้นรนกับปัญหาที่สำคัญ",

    // Product Section
    product_label: "โซลูชัน",
    product_title: "รู้จัก PANYA",
    product_subtitle:
      "ผู้ช่วยอัจฉริยะที่ขับเคลื่อนด้วย Retrieval-Augmented Generation",
    feature1_title: "คำตอบจากเอกสาร",
    feature1_text:
      "คำตอบถูกดึงและสร้างจากคู่มือ PLC และเอกสารเทคนิคที่คัดสรร ไม่ใช่การคาดเดา",
    feature2_title: "การอ้างอิงและตรวจสอบ",
    feature2_text:
      "ทุกคำตอบมีการอ้างอิงแหล่งที่มาพร้อมเลขหน้าและเอกสารอ้างอิงสำหรับการตรวจสอบ",
    feature3_title: "รหัสข้อผิดพลาดและการแก้ไข",
    feature3_text:
      "รับคำแนะนำการแก้ไขปัญหาแบบ step-by-step สำหรับรหัสข้อผิดพลาดและอาการระบบเฉพาะ",
    feature4_title: "คำถามเพื่อชี้แจง",
    feature4_text:
      "เมื่อข้อมูลไม่สมบูรณ์ PANYA จะถามคำถามที่เกี่ยวข้องเพื่อให้ความช่วยเหลือที่แม่นยำ",
    feature5_title: "ส่งต่อผู้เชี่ยวชาญ",
    feature5_text:
      "การส่งต่อที่ราบรื่นไปยังผู้เชี่ยวชาญผ่านแชทหรือโทรศัพท์เมื่อความมั่นใจต่ำหรือความเสี่ยงสูง",
    feature6_title: "การปรับปรุงอย่างต่อเนื่อง",
    feature6_text:
      "คำตอบจากผู้เชี่ยวชาญสามารถตรวจสอบและเพิ่มในฐานความรู้ เพื่อปรับปรุงการตอบสนองในอนาคต",
    why_different_title: "ทำไม PANYA จึงแตกต่าง",
    why_different_text:
      "ไม่เหมือน AI chatbot ทั่วไป PANYA ผสมผสานการค้นหาเอกสารที่ตรวจสอบแล้วกับแนวทางที่ให้ความปลอดภัยเป็นสำคัญ ทุกคำตอบสามารถตรวจสอบย้อนกลับไปยังแหล่งที่มา และสถานการณ์ที่มีความเสี่ยงสูงจะส่งต่อให้ผู้เชี่ยวชาญโดยอัตโนมัติ",
    why_badge1: "เวิร์กโฟลว์ที่ตรวจสอบ",
    why_badge2: "ออกแบบความปลอดภัยก่อน",

    // How It Works
    how_label: "กระบวนการ",
    how_title: "PANYA ทำงานอย่างไร",
    step1_title: "การจัดทำดัชนีเอกสาร",
    step1_text:
      "คู่มือ PLC และเอกสารเทคนิคที่คัดสรรถูกประมวลผลและจัดทำดัชนีเพื่อการค้นหาที่มีประสิทธิภาพ",
    step2_title: "ถามคำถาม",
    step2_text:
      "ช่างเทคนิคถามคำถามโดยใช้รหัสข้อผิดพลาด อาการ หรือคำอธิบายภาษาธรรมชาติ",
    step3_title: "ดึงและจัดอันดับ",
    step3_text: "ระบบดึงและจัดอันดับส่วนที่เกี่ยวข้องมากที่สุดจากฐานความรู้",
    step4_title: "สร้างคำตอบ",
    step4_text:
      "สร้างคำตอบแบบ step-by-step พร้อมการอ้างอิงแบบ inline ที่เชื่อมโยงไปยังเอกสารต้นฉบับ",
    step5_title: "การส่งต่ออัจฉริยะ",
    step5_text:
      "หากความมั่นใจต่ำหรือปัญหามีความเสี่ยงสูง ระบบจะแนะนำให้ส่งต่อให้ผู้เชี่ยวชาญ",
    step6_title: "การตรวจสอบความรู้",
    step6_text:
      "คำตอบจากผู้เชี่ยวชาญสามารถตรวจสอบและยืนยัน จากนั้นเพิ่มในฐานความรู้สำหรับการสอบถามในอนาคต",

    // Prototype
    prototype_label: "ตัวอย่าง",
    prototype_title: "ดู PANYA ในการทำงาน",
    prototype_subtitle:
      "สัมผัสอินเทอร์เฟซต้นแบบที่ออกแบบสำหรับช่างเทคนิคบนพื้นโรงงาน",
    proto_chat_user: "Q03UDV CPU error 4100 - หมายถึงอะไร?",
    proto_chat_ai:
      "Error 4100 บ่งบอกถึง OPERATION ERROR ไม่สามารถประมวลผลคำสั่งได้อย่างถูกต้อง ตรวจสอบ: 1) ไวยากรณ์โปรแกรม, 2) ช่วงอุปกรณ์, 3) ความเข้ากันได้ของคำสั่ง",
    proto_cite1: "คู่มือ QCPU, หน้า 312",
    proto_cite2: "คู่มือแก้ไขปัญหา, หน้า 45",
    proto_escalate: "ส่งต่อ",
    proto_mobile_user: "รีเซ็ต FX5U อย่างไร?",
    proto_mobile_ai:
      "เพื่อรีเซ็ตโมดูล CPU FX5U: 1) ปิดระบบ, 2) กดสวิตช์ RESET ค้างไว้ 2+ วินาที, 3) เปิดระบบขณะกด RESET ค้างไว้",
    proto_mobile_cite: "ฮาร์ดแวร์ FX5U, หน้า 28",
    proto_feature1: "การอ้างอิง inline",
    proto_feature2: "ฟีดแบ็กที่เป็นประโยชน์",
    proto_feature3: "ส่งต่อคลิกเดียว",

    // Results
    results_label: "การประเมิน",
    results_title: "ประสิทธิภาพที่วัดได้",
    results_subtitle: "ต้นแบบของเราได้รับการประเมินโดยใช้มาตรฐาน RAGAs",
    metric_response_label: "เวลาตอบกลับเฉลี่ย",
    metric_response_note: "การทดสอบต้นแบบ",
    metric_faith_label: "ความถูกต้อง",
    metric_relevancy_label: "ความเกี่ยวข้อง",
    metric_precision_label: "ความแม่นยำ",
    metric_recall_label: "การเรียกคืน",
    evaluation_note:
      "ประเมินโดยใช้คำถามทดสอบที่มีคำตอบที่รู้จักกับเอกสาร PLC ที่คัดสรร ผลลัพธ์สะท้อนประสิทธิภาพต้นแบบและจะปรับปรุงด้วยการพัฒนาอย่างต่อเนื่อง",

    // Pricing
    // Pricing - Thai B2B
    pricing_label: "แพ็กเกจราคา",
    pricing_title: "แผนบริการระดับอุตสาหกรรม",
    pricing_subtitle:
      "โซลูชันที่ขยายขนาดได้ ตั้งแต่ช่างเทคนิครายบุคคลจนถึงองค์กรหลายสาขา",
    price_period: "/เดือน",
    price_custom: "ประเมินราคา",

    // Plan 1
    plan_starter_name: "Free",
    plan_starter_desc: "สำหรับช่างเทคนิครายบุคคลและการแก้ไขปัญหาเบื้องต้น",
    plan_starter_f1: "สูงสุด 100 คำถาม/เดือน",
    plan_starter_f2: "รองรับ Mitsubishi PLC",
    plan_starter_f3: "เข้าถึงเอกสารมาตรฐาน",
    plan_starter_f4: "สนับสนุนผ่าน Community Forum",
    plan_cta_start: "เริ่มใช้งานฟรี",

    // Plan 2
    popular_badge: "คุ้มค่าที่สุด",
    plan_pro_name: "Plan Pro",
    plan_pro_desc: "สำหรับทีมบำรุงรักษาประจำโรงงานที่ต้องการบันทึก Audit Logs",
    plan_pro_f1: "ถามตอบไม่จำกัด",
    plan_pro_f2: "รองรับหลายแบรนด์ (Mitsubishi, Siemens, AB)",
    plan_pro_f3: "Audit logs และการอ้างอิงละเอียด",
    plan_pro_f4: "ส่งต่อผู้เชี่ยวชาญ (กรณีเร่งด่วน)",
    plan_pro_f5: "สนับสนุนทางอีเมล & แชท",
    plan_cta_pro: "ทดลองใช้ Pro 14 วัน",

    // Plan 3
    plan_enterprise_name: "Corporate Suite",
    plan_enterprise_desc: "สำหรับองค์กรหลายสาขาที่เน้นความปลอดภัยข้อมูล",
    plan_enterprise_f1: "ทุกฟีเจอร์ใน Plan Pro",
    plan_enterprise_f2: "ติดตั้ง Private Cloud / On-Premise",
    plan_enterprise_f3: "ทำ Index ฐานความรู้เฉพาะองค์กร",
    plan_enterprise_f4: "SSO (Okta/AD) & กำหนดสิทธิ์รายคน",
    plan_enterprise_f5: "ผู้ดูแลบัญชีส่วนตัว (Key Account)",
    plan_enterprise_f6: "รับประกัน SLA (99.9% Uptime)",
    plan_cta_enterprise: "ติดต่อฝ่ายขายองค์กร",

    // FAQ
    faq_label: "คำถามที่พบบ่อย",
    faq_title: "คำถามที่พบบ่อย",
    faq1_question: "คำตอบของ PANYA แม่นยำแค่ไหน?",
    faq1_answer:
      "PANYA ใช้ Retrieval-Augmented Generation (RAG) เพื่อให้คำตอบทั้งหมดอิงจากเอกสารที่ตรวจสอบแล้ว ต้นแบบของเราบรรลุ 79% ความถูกต้องและ 89% ความเกี่ยวข้องบนมาตรฐาน RAGAs ทุกคำตอบมีการอ้างอิงเพื่อให้คุณสามารถตรวจสอบแหล่งที่มาได้",
    faq2_question: "หากคู่มือไม่มีคำตอบจะทำอย่างไร?",
    faq2_answer:
      "เมื่อเอกสารไม่เพียงพอหรือความมั่นใจต่ำ PANYA จะแนะนำให้ส่งต่อให้ผู้เชี่ยวชาญ ระบบการส่งต่อช่วยให้ช่างเทคนิคได้รับความช่วยเหลือที่เชื่อถือได้เสมอ ไม่ว่าจะจาก AI หรือจากวิศวกรที่มีประสบการณ์",
    faq3_question: "จัดการความเป็นส่วนตัวของข้อมูลอย่างไร?",
    faq3_answer:
      "แผน Starter ใช้เอกสาร PLC ที่เปิดเผยต่อสาธารณะ แผน Pro และ Enterprise สามารถรวมฐานความรู้ส่วนตัวของคุณในขณะที่รักษาข้อมูลทั้งหมดให้ปลอดภัย ลูกค้า Enterprise ได้รับโครงสร้างพื้นฐานเฉพาะพร้อมการแยกข้อมูลอย่างสมบูรณ์",
    faq4_question: "รองรับ PLC ยี่ห้อใดบ้าง?",
    faq4_answer:
      "ปัจจุบัน PANYA รองรับ Mitsubishi, Siemens และ Phoenix Contact PLC เรากำลังขยายไลบรารีเอกสารอย่างต่อเนื่อง ลูกค้า Enterprise สามารถขอรองรับ PLC แบบกำหนดเองและการจัดทำดัชนีเอกสารส่วนตัว",
    faq5_question: "คำตอบจากผู้เชี่ยวชาญสามารถปรับปรุงระบบได้หรือไม่?",
    faq5_answer:
      "ใช่ เมื่อผู้เชี่ยวชาญแก้ไขปัญหาที่ส่งต่อมา คำตอบของพวกเขาสามารถตรวจสอบและยืนยันผ่านเวิร์กโฟลว์ Draft → Reviewed → Verified คำตอบที่ยืนยันแล้วจะกลายเป็นส่วนหนึ่งของฐานความรู้ ปรับปรุงความสามารถของ PANYA อย่างต่อเนื่อง",

    // Contact
    // Contact - Thai B2B
    contact_label: "โซลูชันสำหรับองค์กร",
    contact_title: "ยกระดับการปฏิบัติงานบำรุงรักษา",
    contact_subtitle: "นัดหมายปรึกษากับผู้เชี่ยวชาญด้านระบบอัตโนมัติของเรา",
    form_name_label: "ชื่อ - นามสกุล",
    form_name_error: "กรุณากรอกชื่อ-นามสกุล",
    form_job_label: "ตำแหน่งงาน",
    form_job_error: "กรุณากรอกตำแหน่งงาน",
    form_email_label: "อีเมลบริษัท (Work Email)",
    form_email_error: "กรุณากรอกอีเมลบริษัทที่ถูกต้อง",
    form_phone_label: "เบอร์โทรศัพท์",
    form_phone_error: "กรุณากรอกเบอร์โทรศัพท์",
    form_company_label: "ชื่อบริษัท",
    form_message_label: "รายละเอียดโครงการ / ความต้องการ",
    form_message_error: "กรุณาระบุรายละเอียดความต้องการ",
    form_submit: "นัดหมายปรึกษา",
    form_success_title: "ได้รับข้อมูลแล้ว",
    form_success_text: "ทีมงานฝ่ายองค์กรจะติดต่อกลับภายใน 24 ชั่วโมง",
    contact_email_title: "ฝ่ายขายองค์กร",
    contact_phone_title: "สายด่วนสนับสนุน",
    contact_location_title: "สำนักงานใหญ่",
    contact_location_text: "มหาวิทยาลัยบูรพา",
    // Footer
    footer_tagline: "การสนับสนุนทางเทคนิคอัจฉริยะสำหรับระบบอัตโนมัติอุตสาหกรรม",
    footer_links_title: "ผลิตภัณฑ์",
    footer_support_title: "สนับสนุน",
    footer_privacy: "นโยบายความเป็นส่วนตัว",
    footer_terms: "ข้อกำหนดการใช้งาน",
    footer_team_title: "ทีมของเรา",
    footer_team_text:
      "พัฒนาโดยทีมนักวิจัย AI และผู้เชี่ยวชาญด้านระบบอัตโนมัติอุตสาหกรรมที่มุ่งมั่นลด downtime ผ่านระบบสนับสนุนอัจฉริยะ",
    footer_copyright: "© 2024 PANYA. สงวนลิขสิทธิ์",
  },
};
