const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pres = new pptxgen();

// Presentation Setup
pres.layout = 'LAYOUT_16x9';
pres.author = 'SUSAMBIL Team';
pres.company = 'SUSAMBIL Travel Ecosystem';
pres.title = 'SUSAMBIL - O‘zbekiston Milliy Turizm Ekotizimi';
pres.subject = 'Startup & Inbound Tourism Pitch Deck';

// Brand Colors
const EMERALD_DARK = '0B241C';
const EMERALD = '124C3A';
const EMERALD_LIGHT = '1E6B52';
const GOLD = 'C8A66A';
const GOLD_LIGHT = 'E9DCC5';
const WHITE = 'FFFFFF';
const SLATE_BG = 'F8FAFC';
const TEXT_MUTED = '64748B';

// Helper: Dark Background Slide
function createDarkSlide(titleBadge, mainTitle, subtitle, speakerNote) {
  const slide = pres.addSlide();
  slide.background = { color: EMERALD_DARK };

  // Subtle decorative accents
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.1,
    fill: { color: GOLD }, line: { color: GOLD }
  });

  if (titleBadge) {
    slide.addText(titleBadge.toUpperCase(), {
      x: 0.8, y: 0.55, w: 3.5, h: 0.35,
      fontSize: 10, fontFace: 'Arial', bold: true,
      color: GOLD, fill: { color: '163E30' },
      align: 'center'
    });
  }

  if (mainTitle) {
    slide.addText(mainTitle, {
      x: 0.8, y: titleBadge ? 1.0 : 0.6, w: 11.5, h: 0.8,
      fontSize: 24, fontFace: 'Arial', bold: true,
      color: WHITE, align: 'left'
    });
  }

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 1.8, w: 11.5, h: 0.45,
      fontSize: 13, fontFace: 'Arial',
      color: GOLD_LIGHT, align: 'left'
    });
  }

  // Footer branding
  slide.addText('SUSAMBIL © 2026 | Discover Uzbekistan. Your Journey, One Platform.', {
    x: 0.8, y: 7.0, w: 10, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: '5B7A6E'
  });

  if (speakerNote) {
    slide.addNotes(speakerNote);
  }

  return slide;
}

// ==========================================
// SLIDE 1: MUQOVA
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: EMERALD_DARK };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.12,
    fill: { color: GOLD }, line: { color: GOLD }
  });

  slide.addText('✨ STARTUP & TURIZM INNOVATSIYASI 2026', {
    x: 1.0, y: 0.9, w: 4.8, h: 0.4,
    fontSize: 11, fontFace: 'Arial', bold: true,
    color: GOLD, fill: { color: '17382D' },
    align: 'center'
  });

  slide.addText('SUSAMBIL', {
    x: 1.0, y: 1.5, w: 11.0, h: 1.2,
    fontSize: 52, fontFace: 'Arial', bold: true,
    color: GOLD, align: 'left'
  });

  slide.addText('O‘zbekistonning Barcha Turizm Xizmatlarini Birlashtiruvchi Yagona Aqlli Ekotizim', {
    x: 1.0, y: 2.8, w: 11.0, h: 0.7,
    fontSize: 19, fontFace: 'Arial',
    color: WHITE, align: 'left'
  });

  slide.addText('“Discover Uzbekistan. Your Journey, One Platform.”', {
    x: 1.0, y: 3.5, w: 11.0, h: 0.5,
    fontSize: 15, fontFace: 'Arial', italic: true,
    color: GOLD_LIGHT, align: 'left'
  });

  // 4 Metric cards
  const stats = [
    { title: '15+ Tillar', desc: 'To‘liq ko‘p tilli qamrov' },
    { title: '60 soniya', desc: 'AI Sayohat Plani' },
    { title: 'QR E-Voucher', desc: 'Afrosiyob & Aviakassa' },
    { title: '100% Rasmiy', desc: 'Tasdiqlangan gidlar' }
  ];

  stats.forEach((st, idx) => {
    const xPos = 1.0 + idx * 2.85;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 4.6, w: 2.65, h: 1.6,
      fill: { color: '133328' },
      line: { color: GOLD, width: 1 }
    });
    slide.addText(st.title, {
      x: xPos, y: 4.8, w: 2.65, h: 0.5,
      fontSize: 17, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'center'
    });
    slide.addText(st.desc, {
      x: xPos, y: 5.4, w: 2.65, h: 0.5,
      fontSize: 11, fontFace: 'Arial',
      color: WHITE, align: 'center'
    });
  });

  slide.addNotes(
    "Assalomu alaykum hurmatli hakamlar hay’ati va qatnashchilar! Bugun sizlarga O‘zbekiston turizm sohasini raqamlashtirishda yangi bosqichni ochib beruvchi innovatsion loyihamiz — SUSAMBIL platformasini taqdim etishdan mamnunmiz. Shiorimiz: 'Discover Uzbekistan. Your Journey, One Platform.' Ya'ni, O'zbekiston bo'ylab sayohatning barcha bosqichlarini bitta platformada birlashtirdik."
  );
}

// ==========================================
// SLIDE 2: MUAMMO
// ==========================================
{
  const slide = createDarkSlide(
    '⚠️ Bozor Muammolari',
    'Bugun O‘zbekistonga kelayotgan sayohatchi nimalardan qiynalmoqda?',
    'Xorijiy va mahalliy sayyohlar duch kelayotgan 4 ta jiddiy to‘siq:',
    "Mamlakatimizga har yili millionlab sayyohlar kelmoqda. Biroq bugungi amaliyotda ularning yo‘li bir nechta tarqoq saytlardan o‘tadi: poyezd chiptasini olish bir muammo, milliy mehmonxonalarni topish ikkinchi muammo, ishonchli gid topish esa Telegram guruhlaridagi tavakkalga aylanib qolgan. Natijada sayyoh ko‘p vaqt va ortiqcha pul yo‘qotadi."
  );

  const problems = [
    { num: '01', title: 'Haddan tashqari tarqoqlik', text: 'Chipta olish, mehmonxona band qilish, transport va gid topish 4-5 xil manbalarda bo‘linib ketgan.' },
    { num: '02', title: 'Til va Axborot to‘sig‘i', text: 'Ko‘plab davlat xizmatlari faqat 2-3 tilda mavjud. Yaponiya, Xitoy, arab va Yevropa sayyohlari uchun noqulay.' },
    { num: '03', title: 'Noaniq narxlar & Vositachilar', text: 'Litsenziyasiz shaxslar, kutilmagan taksi narxlari va qora bozordagi poyezd chiptalari ishonchni susaytiradi.' },
    { num: '04', title: 'Raqamli rejalashtirish yo‘qligi', text: 'Sayohatchi o‘z byudjeti, kunlari va qiziqishlariga mos marshrutni tuzish uchun soatlab vaqt sarflaydi.' }
  ];

  problems.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 0.8 + col * 5.8;
    const yPos = 2.4 + row * 2.1;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 5.5, h: 1.85,
      fill: { color: '241113' },
      line: { color: 'F87171', width: 1 }
    });

    slide.addText(`${p.num}. ${p.title}`, {
      x: xPos + 0.3, y: yPos + 0.2, w: 4.9, h: 0.45,
      fontSize: 15, fontFace: 'Arial', bold: true,
      color: 'FCA5A5', align: 'left'
    });

    slide.addText(p.text, {
      x: xPos + 0.3, y: yPos + 0.7, w: 4.9, h: 0.95,
      fontSize: 11, fontFace: 'Arial',
      color: WHITE, align: 'left'
    });
  });
}

// ==========================================
// SLIDE 3: YECHIM
// ==========================================
{
  const slide = createDarkSlide(
    '💡 Bizning Yechim',
    'SUSAMBIL: Butun O‘zbekiston Bir Darchada',
    'Sayohat g‘oyasidan tortib unutilmas xotiralargacha yagona integratsiyalashgan tizim:',
    "Bizning yechimimiz — SUSAMBIL. Bu sayohatchining shaxsiy aqlli yo‘lboshchisi. Sayyoh saytga kirib, o‘z byudjetini kiritadi, AI yordamida to‘liq marshrut tuzadi, bir klik bilan Afrosiyobga QR-chipta xarid qiladi va sertifikatlangan gid bilan bog‘lanadi. Barchasi bir joyda va shaffof narxlarda!"
  );

  const solutions = [
    { icon: '🎯', title: 'Barchasi Bitta Ekranda', text: 'Afrosiyob poyezd chiptalari, ichki reyslar, 500+ milliy mehmonxonalar va eng yaxshi gidlar bir ekotizimda mujassam.' },
    { icon: '🤖', title: 'Aqlli AI Hamroh', text: 'Byudjet, sayohat kunlari va qiziqishga qarab 1 daqiqada tayyor reja, xarajatlar tahlili va interaktiv marshrut tuzib beradi.' },
    { icon: '🌐', title: '15 Tilda Erkin Muloqot', text: 'Sayohatchi o‘z ona tilida ma’lumot oladi, qulay to‘lov qiladi va kafolatlangan QR elektron chipta oladi.' }
  ];

  solutions.forEach((s, idx) => {
    const xPos = 0.8 + idx * 3.9;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 2.5, w: 3.65, h: 3.9,
      fill: { color: '133328' },
      line: { color: GOLD, width: 1.5 }
    });

    slide.addText(s.icon, {
      x: xPos, y: 2.8, w: 3.65, h: 0.6,
      fontSize: 30, align: 'center'
    });

    slide.addText(s.title, {
      x: xPos + 0.2, y: 3.6, w: 3.25, h: 0.6,
      fontSize: 15, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'center'
    });

    slide.addText(s.text, {
      x: xPos + 0.25, y: 4.3, w: 3.15, h: 1.7,
      fontSize: 11, fontFace: 'Arial',
      color: WHITE, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 4: SMART AI PLANNER
// ==========================================
{
  const slide = createDarkSlide(
    '🧠 Asosiy Innovatsiya',
    'Smart AI Sayohat Plani: 60 Soniyada Shaxsiy Marshrut',
    'Har bir sayyohning qiziqishi, vaqti va hamyoniga 100% moslashgan algoritm:',
    "Loyiha durdonasi — Smart AI Planner. Sayyoh shaharlarni, kunlar sonini va o'z byudjetini tanlaydi. Sun'iy intellekt har bir kun uchun aniq soatlarga bo'lingan dastur tuzadi: qaysi vaqtda Registonga borish kerak, qaysi oshxonada tushlik qilish qulay va kuniga qancha pul sarflanadi. Shuningdek, PDF shaklida yuklab olish va chop etish imkoniyati ham mavjud."
  );

  const points = [
    { title: 'Shaxsiylashtirilgan takliflar', desc: 'Tarixiy, gastro-turizm, tabiat, oilaviy yoki ekstremal yo‘nalishlar' },
    { title: 'Soatbay kunlik dastur', desc: 'Har bir diqqatga sazovor maskan vaqt taqsimoti va qulay logistika' },
    { title: 'Aniq xarajatlar kalkulyatori', desc: 'Turar-joy, ovqatlanish, kirish chiptalari va transport xarajatlari balansi' },
    { title: 'Bir klik bilan PDF / Chop etish', desc: 'Internetsiz holatda ham sayyoh cho‘ntagida qog‘oz yoki oflayn nusxa' }
  ];

  points.forEach((p, idx) => {
    const yPos = 2.4 + idx * 1.05;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.8, y: yPos + 0.05, w: 0.3, h: 0.3,
      fill: { color: GOLD }, line: { color: GOLD }
    });
    slide.addText(p.title, {
      x: 1.25, y: yPos, w: 5.2, h: 0.35,
      fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
    });
    slide.addText(p.desc, {
      x: 1.25, y: yPos + 0.35, w: 5.2, h: 0.5,
      fontSize: 11, fontFace: 'Arial', color: WHITE
    });
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 2.4, w: 5.4, h: 4.1,
    fill: { color: '14392E' },
    line: { color: GOLD, width: 1 }
  });

  slide.addText('⚡ REJALASHTIRUVCHI SIMULYATSIYASI', {
    x: 7.1, y: 2.7, w: 4.8, h: 0.35,
    fontSize: 11, fontFace: 'Arial', bold: true, color: GOLD
  });

  const simLines = [
    { label: 'Marshrut:', val: 'Toshkent ➔ Samarqand ➔ Buxoro' },
    { label: 'Sayohat muddati:', val: '4 kun / 3 kecha' },
    { label: 'Rejalashtirilgan byudjet:', val: '$350 (O‘rtacha qulaylik)' },
    { label: 'Tavsiya etilgan poyezd:', val: 'Afrosiyob #762 (08:00)' },
    { label: 'Ekskursiya dasturi:', val: 'Registon, Shohi Zinda, Labi Hovuz' }
  ];

  simLines.forEach((sl, idx) => {
    const yP = 3.2 + idx * 0.6;
    slide.addText(sl.label, {
      x: 7.1, y: yP, w: 2.2, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: 'A3C2B6'
    });
    slide.addText(sl.val, {
      x: 9.3, y: yP, w: 2.7, h: 0.5,
      fontSize: 11, fontFace: 'Arial', bold: true, color: WHITE
    });
  });
}

// ==========================================
// SLIDE 5: DINAMIK QR CHIPTALAR
// ==========================================
{
  const slide = createDarkSlide(
    '🎫 Transport & Chiptalar',
    'Dinamik QR-kodli Elektron Chiptalar Tizimi',
    'Kassada navbat kutishlarsiz, qulay to‘lov va rasmiy xalqaro E-Voucher:',
    "Eng ko‘p e’tirozga sabab bo‘ladigan poyezd chiptalari masalasida biz interaktiv E-Ticket tizimini joriy qildik. Foydalanuvchi o‘z vagoni va o‘rindig‘ini tanlab, to‘lovni amalga oshiradi va darhol smartfoniga xalqaro formatdagi QR-kodli vaucher oladi. Hech qanday kassada navbat kutish shart emas."
  );

  const tFeatures = [
    { icon: '🚄', title: 'Afrosiyob & Sharq Poyezdlari', text: 'Toshkent-Samarqand-Buxoro yo‘nalishidagi poyezdlar jadvali, vagon toifalari (VIP, Biznes, Ekonim) va joy tanlash.' },
    { icon: '💳', title: 'Xavfsiz To‘lov Tizimlari', text: 'Milliy Click va Payme, shuningdek xorijiy sayohatchilar uchun Visa va Mastercard orqali onlayn to‘lov.' },
    { icon: '📱', title: 'Rasmiy QR E-Voucher', text: 'Xalqaro PNR shifri, vagon/o‘rindiq raqami va nazoratchilar skaneri uchun dinamik QR-kodli elektron chipta.' }
  ];

  tFeatures.forEach((tf, idx) => {
    const xPos = 0.8 + idx * 3.9;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 2.5, w: 3.65, h: 3.9,
      fill: { color: '133328' },
      line: { color: GOLD, width: 1 }
    });

    slide.addText(tf.icon, {
      x: xPos, y: 2.8, w: 3.65, h: 0.6,
      fontSize: 30, align: 'center'
    });

    slide.addText(tf.title, {
      x: xPos + 0.2, y: 3.6, w: 3.25, h: 0.6,
      fontSize: 15, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'center'
    });

    slide.addText(tf.text, {
      x: xPos + 0.25, y: 4.3, w: 3.15, h: 1.8,
      fontSize: 11, fontFace: 'Arial',
      color: WHITE, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 6: INTERAKTIV XARITA & HIDDEN UZBEKISTAN
// ==========================================
{
  const slide = createDarkSlide(
    '🗺️ Noyob Kontent',
    'Interaktiv Ipak Yo‘li Xaritasi & Yashirin Go‘zalliklar',
    'Tarixiy obidalardan tortib tog‘ va sahrolardagi ekoturizm maskanlarigacha:',
    "Faqat Registon va Ichan-Qal'a bilan cheklanib qolmadik. SUSAMBIL interaktiv Ipak Yo'li xaritasiga ega bo'lib, unda barcha viloyatlar va 'Hidden Uzbekistan' ya'ni kam o'rganilgan, ammo nihoyatda go'zal Boysun, Zomin, Oydarko'l, Aral dengizi kabi ekoturizm va etnoturizm maskanlari jamlangan."
  );

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 2.5, w: 5.6, h: 4.0,
    fill: { color: '133328' },
    line: { color: GOLD, width: 1 }
  });
  slide.addText('🏛️ SILK ROAD INTERACTIVE MAP', {
    x: 1.1, y: 2.8, w: 5.0, h: 0.4,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  slide.addText(
    '• Toshkent, Samarqand, Buxoro, Xiva va Shahrisabz shaharlari\n• 1 klik bilan har bir shaharning asosiy 5 ta diqqatga sazovor joyi\n• Har bir obida bo‘yicha audio-yo‘lboshchi va ish vaqtlari\n• Shaharlararo tezyurar transport aloqasi ko‘rsatkichlari',
    {
      x: 1.1, y: 3.3, w: 5.0, h: 2.9,
      fontSize: 11.5, fontFace: 'Arial', color: WHITE
    }
  );

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 2.5, w: 5.6, h: 4.0,
    fill: { color: '133328' },
    line: { color: GOLD, width: 1 }
  });
  slide.addText('🏔️ "HIDDEN UZBEKISTAN" EKOTURIZM', {
    x: 7.1, y: 2.8, w: 5.0, h: 0.4,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  slide.addText(
    '• Zomin tog‘lari va archazorlari (O‘zbekiston Shveytsariyasi)\n• Boysun etno-folklor hududi va Omonxona shifobaxsh buloqlari\n• Oydarko‘l o‘tovli oromgohlari va cho‘l safari yo‘nalishlari\n• Orol dengizi fojiasi va Mo‘ynoq kema qabristoni',
    {
      x: 7.1, y: 3.3, w: 5.0, h: 2.9,
      fontSize: 11.5, fontFace: 'Arial', color: WHITE
    }
  );
}

// ==========================================
// SLIDE 7: 15 TA TIL
// ==========================================
{
  const slide = createDarkSlide(
    '🌍 Global Qamrov',
    '15 ta Xalqaro Tilda To‘liq Lokalizatsiya',
    'Dunyoning istalgan davlatidan kelgan sayyoh o‘z ona tilida erkin foydalanadi:',
    "Eng katta yutuqlarimizdan biri — platformaning to'liq 15 ta tilda ishlashidir. Sayohatchi nafaqat o'zbek, rus yoki ingliz, balki yapon, xitoy, arab, ispan, koreys, nemis va boshqa 15 ta xalqaro tilda platformadan bemalol foydalana oladi. Bu O'zbekiston turizmini dunyoning istalgan nuqtasidan turib kirib kelishiga eshik ochadi."
  );

  const langs = [
    { flag: '🇺🇿', name: 'O‘zbekcha' },
    { flag: '🇷🇺', name: 'Русский' },
    { flag: '🇬🇧', name: 'English' },
    { flag: '🇨🇳', name: '中文 (Xitoy)' },
    { flag: '🇯🇵', name: '日本語 (Yapon)' },
    { flag: '🇩🇪', name: 'Deutsch (Nemis)' },
    { flag: '🇫🇷', name: 'Français (Fransuz)' },
    { flag: '🇪🇸', name: 'Español (Ispan)' },
    { flag: '🇦🇪', name: 'العربية (Arab)' },
    { flag: '🇰🇷', name: '한국어 (Koreys)' },
    { flag: '🇹🇷', name: 'Türkçe' },
    { flag: '🇮🇹', name: 'Italiano' },
    { flag: '🇵🇹', name: 'Português' },
    { flag: '🇮🇳', name: 'हिन्दी (Hindiy)' },
    { flag: '🇮🇷', name: 'فارسی (Forsiy)' }
  ];

  langs.forEach((lng, idx) => {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    const xPos = 0.8 + col * 2.32;
    const yPos = 2.5 + row * 1.35;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 2.15, h: 1.15,
      fill: { color: '14392E' },
      line: { color: GOLD, width: 1 }
    });

    slide.addText(`${lng.flag}  ${lng.name}`, {
      x: xPos, y: yPos + 0.35, w: 2.15, h: 0.45,
      fontSize: 11, fontFace: 'Arial', bold: true,
      color: WHITE, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 8: BIZNES MODEL
// ==========================================
{
  const slide = createDarkSlide(
    '💰 Biznes Model',
    'Monetizatsiya va Daromad Manbalari',
    'Shaffof komissiya va barqaror rentabellikka asoslangan biznes model:',
    "SUSAMBIL shunchaki axborot sayti emas, balki yuqori daromad keltiruvchi barqaror biznes modelga ega. Biz mehmonxonalarni band qilishdan 10-15%, poyezd va samolyot chiptalaridan 3-5%, gidlar xizmatidan 12% komissiya olamiz. Shuningdek, turistik kompaniyalar uchun B2B tahlil paneli va xususiy brendlar uchun reklama maydonchasi mavjud."
  );

  const streams = [
    { pct: '10-15%', title: 'Mehmonxonalar', desc: 'Har bir muvaffaqiyatli xona band qilishdan olinadigan komissiya ulushi.' },
    { pct: '3-5%', title: 'Chiptalar Savdosi', desc: 'Afrosiyob poyezdlari va ichki aviaparvozlardan servis xizmati to‘lovi.' },
    { pct: '12%', title: 'Gidlar va Turlar', desc: 'Sertifikatlangan gidlar buyurtmasi va maxsus etno-turlar savdosidan.' },
    { pct: 'SaaS', title: 'B2B Hamkorlik', desc: 'Mehmonxona egalari va turoperatorlar uchun analitika kabineti obunasi.' }
  ];

  streams.forEach((st, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 2.5, w: 2.75, h: 3.9,
      fill: { color: '133328' },
      line: { color: GOLD, width: 1.5 }
    });

    slide.addText(st.pct, {
      x: xPos, y: 2.8, w: 2.75, h: 0.7,
      fontSize: 26, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'center'
    });

    slide.addText(st.title, {
      x: xPos + 0.15, y: 3.6, w: 2.45, h: 0.5,
      fontSize: 15, fontFace: 'Arial', bold: true,
      color: WHITE, align: 'center'
    });

    slide.addText(st.desc, {
      x: xPos + 0.15, y: 4.3, w: 2.45, h: 1.7,
      fontSize: 11, fontFace: 'Arial',
      color: GOLD_LIGHT, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 9: BOZOR HAJMI
// ==========================================
{
  const slide = createDarkSlide(
    '📈 Bozor Tahlili',
    'Bozor Hajmi va O‘sish Potensiali',
    'O‘zbekiston va Markaziy Osiyo turizm bozorining ulkan imkoniyatlari:',
    "Bozor salohiyati nihoyatda ulkan. O'zbekiston hukumati 2026-yilga qadar yillik xorijiy sayyohlar oqimini 10 million nafarga yetkazishni maqsad qilgan. Ichki turizm hajmi esa yiliga 15 million sayohatni tashkil etadi. SUSAMBIL ushbu oqimning eng qulay va ishonchli raqamli darvozasi bo'lishga to'liq tayyor."
  );

  const markets = [
    { tag: 'TAM (Umumiy Bozor)', val: '$2.5+ Milyard', desc: 'Markaziy Osiyo bo‘yicha yillik sayohat va turizm xizmatlari umumiy aylanmasi.' },
    { tag: 'SAM (O‘zbekiston Bozori)', val: '10 Million+', desc: '2026-yilga qadar O‘zbekistonga kutilayotgan yillik xorijiy turistlar oqimi.' },
    { tag: 'SOM (Bizning Maqsad)', val: '300,000+', desc: 'Dastlabki 12 oy davomida xizmat ko‘rsatilishi rejalashtirilgan faol sayyohlar.' }
  ];

  markets.forEach((m, idx) => {
    const xPos = 0.8 + idx * 3.9;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 2.5, w: 3.65, h: 3.9,
      fill: { color: '133328' },
      line: { color: GOLD, width: 1.5 }
    });

    slide.addText(m.tag, {
      x: xPos + 0.2, y: 2.8, w: 3.25, h: 0.4,
      fontSize: 11, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'center'
    });

    slide.addText(m.val, {
      x: xPos + 0.1, y: 3.4, w: 3.45, h: 0.8,
      fontSize: 30, fontFace: 'Arial', bold: true,
      color: WHITE, align: 'center'
    });

    slide.addText(m.desc, {
      x: xPos + 0.25, y: 4.4, w: 3.15, h: 1.6,
      fontSize: 12, fontFace: 'Arial',
      color: GOLD_LIGHT, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 10: TEXNOLOGIYA
// ==========================================
{
  const slide = createDarkSlide(
    '⚡ Texnologik Stack',
    'Yuqori Tezlik, Ishonchlilik va Xavfsizlik',
    'Eng ilg‘or xalqaro standartlar asosida ishlab chiqilgan arxitektura:',
    "Loyiha zamonaviy va xavfsiz texnologiyalar ustiga qurilgan. Frontend qismida React 18, Vite va TypeScript ishlatilgan bo'lib, sahifalar 0.5 soniyadan tez yuklanadi. Xavfsizlik bo'yicha maxfiy administrator tizimi, ikki bosqichli tasdiqlash va PWA oflayn ishlash rejimi joriy etilgan."
  );

  const techs = [
    { title: 'React 18 & TS', desc: 'Ultra-tezkor, xatosiz komponentli arxitektura' },
    { title: 'Tailwind CSS', desc: 'Emerald & Gold milliy uslub, 100% responsiv' },
    { title: 'QR Engine', desc: 'Avtomatik dinamik e-vaucher va PNR shifrlash' },
    { title: 'PWA Offline', desc: 'Internet yo‘qligida ham saqlangan chiptalar ochiq' },
    { title: 'Supabase Ready', desc: 'Masshtablanuvchi xavfsiz backend va real-time DB' },
    { title: '2FA Himoya', desc: 'Admin va foydalanuvchilar uchun xavfsiz kirish' }
  ];

  techs.forEach((tc, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPos = 0.8 + col * 3.9;
    const yPos = 2.5 + row * 1.95;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: yPos, w: 3.65, h: 1.7,
      fill: { color: '14392E' },
      line: { color: GOLD, width: 1 }
    });

    slide.addText(tc.title, {
      x: xPos + 0.2, y: yPos + 0.25, w: 3.25, h: 0.45,
      fontSize: 15, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'left'
    });

    slide.addText(tc.desc, {
      x: xPos + 0.2, y: yPos + 0.75, w: 3.25, h: 0.75,
      fontSize: 11, fontFace: 'Arial',
      color: WHITE, align: 'left'
    });
  });
}

// ==========================================
// SLIDE 11: JONLI DEMO REJA
// ==========================================
{
  const slide = createDarkSlide(
    '📱 Jonli Demo',
    'Platforma Amalda Qanday Ishlaydi?',
    'Hakamlar hay’atiga 3 ta aniq bosqichda tizimni namoyish qilish:',
    "Endi esa platformaning real ishlashini amalda ko'rsatamiz. Birgalikda Smart AI Planner orqali Samarqand va Buxoro uchun 3 kunlik reja tuzamiz, Afrosiyob poyezdiga QR-kodli elektron chipta olamiz va 15 ta til o'rtasida bir zumda o'tishni sinab ko'ramiz."
  );

  const steps = [
    { step: '1-Qadam', title: 'Smart AI Marshrut', desc: 'Shaharlar, kunlar va byudjet tanlanib, 1 daqiqada tayyor ekskursiya rejasi olinadi va PDF qilinadi.' },
    { step: '2-Qadam', title: 'QR Chipta Xaridi', desc: 'Afrosiyob poyezdiga chipta tanlanib, to‘lov simulyatsiyasi orqali dinamik QR-kodli vaucher chiqariladi.' },
    { step: '3-Qadam', title: '15 Tilda Boshqaruv', desc: 'Tilni ingliz yoki yaponchaga o‘tkazib, Samarqanddagi sertifikatlangan gid tanlanadi.' }
  ];

  steps.forEach((st, idx) => {
    const xPos = 0.8 + idx * 3.9;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: 2.5, w: 3.65, h: 3.9,
      fill: { color: '133328' },
      line: { color: GOLD, width: 1.5 }
    });

    slide.addText(st.step.toUpperCase(), {
      x: xPos, y: 2.8, w: 3.65, h: 0.4,
      fontSize: 12, fontFace: 'Arial', bold: true,
      color: GOLD, align: 'center'
    });

    slide.addText(st.title, {
      x: xPos + 0.15, y: 3.4, w: 3.35, h: 0.55,
      fontSize: 16, fontFace: 'Arial', bold: true,
      color: WHITE, align: 'center'
    });

    slide.addText(st.desc, {
      x: xPos + 0.25, y: 4.2, w: 3.15, h: 1.8,
      fontSize: 11, fontFace: 'Arial',
      color: GOLD_LIGHT, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 12: XULOSA
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: EMERALD_DARK };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.12,
    fill: { color: GOLD }, line: { color: GOLD }
  });

  slide.addText('🏁 XULOSA & HAMKORLIK', {
    x: 1.0, y: 0.9, w: 3.5, h: 0.4,
    fontSize: 11, fontFace: 'Arial', bold: true,
    color: GOLD, fill: { color: '17382D' },
    align: 'center'
  });

  slide.addText('Kelajak Sayohati Bugun Boshlanadi', {
    x: 1.0, y: 1.5, w: 11.0, h: 0.9,
    fontSize: 42, fontFace: 'Arial', bold: true,
    color: GOLD, align: 'left'
  });

  slide.addText('SUSAMBIL — O‘zbekistonni butun dunyoga kashf ettiruvchi yagona milliy raqamli brend.', {
    x: 1.0, y: 2.5, w: 11.0, h: 0.6,
    fontSize: 17, fontFace: 'Arial',
    color: WHITE, align: 'left'
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.0, y: 3.5, w: 7.2, h: 2.8,
    fill: { color: '133328' },
    line: { color: GOLD, width: 1.5 }
  });

  slide.addText('Biz bilan bog‘lanish va hamkorlik:', {
    x: 1.3, y: 3.7, w: 6.6, h: 0.4,
    fontSize: 15, fontFace: 'Arial', bold: true, color: GOLD
  });

  slide.addText(
    '🌐 Rasmiy veb-sayt: www.susambil.uz\n📧 Email: info@susambil.uz / contact@susambil.travel\n📞 Telefon: +998 (71) 200-00-00\n📍 Manzil: Amir Temur xiyoboni 4, Toshkent shahri',
    {
      x: 1.3, y: 4.2, w: 6.6, h: 1.8,
      fontSize: 13, fontFace: 'Arial', color: WHITE
    }
  );

  slide.addNotes(
    "Xulosa qilib aytganda, SUSAMBIL — O'zbekistonning boy madaniy merosini butun dunyoga eng qulay, xavfsiz va zamonaviy tarzda yetkazib beruvchi ko'prikdir. Biz O'zbekistonni jahon turizm xaritasida 1-raqamli manzilga aylantirishga hissa qo'shamiz. E'tiboringiz uchun katta rahmat, savollaringiz bo'lsa mamnuniyat bilan javob beramiz!"
  );
}

// Write file
const outRoot = path.join(__dirname, '..', 'SUSAMBIL_Taqdimot_Pitch_Deck.pptx');
const outPublic = path.join(__dirname, '..', 'public', 'SUSAMBIL_Taqdimot_Pitch_Deck.pptx');

pres.writeFile({ fileName: outRoot }).then(fName => {
  console.log('SUCCESS: PPTX created at:', outRoot);
  fs.copyFileSync(outRoot, outPublic);
  console.log('SUCCESS: PPTX copied to public:', outPublic);
}).catch(err => {
  console.error('Error generating PPTX:', err);
  process.exit(1);
});
