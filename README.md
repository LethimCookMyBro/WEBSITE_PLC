# PANYA - ระบบผู้ช่วยอัจฉริยะสำหรับการซ่อมบำรุง PLC (RAG-Based Technical Support)

**PANYA** คือเว็บไซต์ Landing Page ที่นำเสนอโซลูชัน AI สำหรับงานซ่อมบำรุงและดูแลรักษาระบบ PLC (Programmable Logic Controller) ในโรงงานอุตสาหกรรม โดยเน้นการออกแบบที่ทันสมัย สวยงาม และน่าเชื่อถือ เพื่อสื่อสารเทคโนโลยี RAG (Retrieval-Augmented Generation) ที่อยู่เบื้องหลังได้อย่างมีประสิทธิภาพ

![PANYA Preview](assets/images/preview.png)

## 🌟 ภาพรวมและจุดเด่นของโปรเจค

โปรเจคนี้ถูกพัฒนาขึ้นด้วยคอนเซปต์ **"Premium & Modern"** โดยเน้น User Experience (UX) ที่ลื่นไหล และ User Interface (UI) ที่ดูสะอาดตาแต่ล้ำสมัย

- **ดีไซน์แบบ Liquid Glass**: ใช้สไตล์ Glassmorphism (กระจกฝ้า) ผสมกับการไล่เฉดสี (Gradients) ให้ความรู้สึกพรีเมียมและดูล้ำยุค
- **รองรับทุกหน้าจอ (Fully Responsive)**: แสดงผลได้อย่างสมบูรณ์แบบตั้งแต่มือถือ แท็บเล็ต ไปจนถึงหน้าจอคอมพิวเตอร์ขนาดใหญ่
- **แอนิเมชันที่ลื่นไหล (Smooth Animations)**:
  - ระบบ **Scroll-Triggered**: เนื้อหาจะค่อยๆ ปรากฏขึ้นเมื่อเลื่อนหน้าจอ
  - **Floating Elements**: วัตถุลอยตัวอิสระเพิ่มมิติให้กับหน้าเว็บ
  - **Responsive Navbar**: เมนูบาร์ด้านบนที่ย่อขยายขนาดได้อัตโนมัติตามการใช้งาน (Shrink Effect) และปรับรูปแบบให้เหมาะสมกับมือถือ
- **สถาปัตยกรรมแบบ Component-Based**: เขียนโค้ดแบบแยกส่วน (Modular) โดยใช้ Vanilla JavaScript ในการโหลดชิ้นส่วน HTML (เช่น Navbar, Footer) เข้ามาประกอบกัน ทำให้โค้ดสะอาดและดูแลรักษาง่าย
- **ระบบธีม (Dark/Light Mode)**: สลับโหมดมืด-สว่างได้ทันที พร้อมระบบจำค่าการใช้งานล่าสุด
- **รองรับ 2 ภาษา**: โครงสร้างเตรียมพร้อมสำหรับสลับภาษาไทยและอังกฤษ

## ⚙️ เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจคนี้เน้นประสิทธิภาพ (Performance) โดยไม่พึ่งพา Framework หนักๆ เขียนด้วยมาตรฐานเว็บยุคใหม่:

- **HTML5**: โครงสร้างแบบ Semantic Component แยกไฟล์ดูแล
- **CSS3 (Modern Vanilla)**:
  - ใช้ **CSS Variables (Custom Properties)** จัดการ Design Tokens (สี, ระยะห่าง, ฟอนต์)
  - **Flexbox & Grid Layout** สำหรับการจัดหน้า
  - **Backdrop-filter** สำหรับเอฟเฟกต์กระจก
- **JavaScript (ES6+)**:
  - **Modular Architecture**: แยกไฟล์สคริปต์เป็นโมดูลให้ดูแลรักษาง่าย
  - **Intersection Observer API**: สำหรับตรวจจับการเลื่อนหน้าจอเพื่อเล่นแอนิเมชันโดยไม่หน่วงเครื่อง
  - **Custom Component Loader**: ระบบโหลดไฟล์ HTML อัตโนมัติที่เขียนขึ้นเอง
- **Libraries ภายนอก**:
  - [FontAwesome](https://fontawesome.com): ชุดไอคอนมาตรฐาน
  - [Google Fonts](https://fonts.google.com): ฟอนต์ Inter (อังกฤษ) และ Noto Sans Thai (ไทย)
  - [Particles.js](https://vincentgarreau.com/particles.js/): เอฟเฟกต์พื้นหลังส่วน Hero Section

## 📁 โครงสร้างไฟล์ (Project Structure)

```text
PLCPANYA/
├── assets/
│   ├── css/            # ไฟล์ CSS สำหรับตกแต่งหน้าเว็บ
│   ├── js/             # ไฟล์ JavaScript การทำงานหลัก
│   │   ├── modules/    # โมดูลย่อย (จัดการ UI, แอนิเมชัน)
│   │   └── app.js      # จุดเริ่มต้นของโปรแกรม (Entry Point)
│   └── images/         # รูปภาพประกอบ
├── components/         # ชิ้นส่วนหน้าเว็บ (Navbar, Hero, Footer ฯลฯ)
├── index.html          # หน้าหลักของเว็บไซต์
└── README.md           # เอกสารประกอบโปรเจค
```

## 🚀 การติดตั้งและรันโปรเจค

เนื่องจากโปรเจคนี้มีการใช้ `fetch API` ในการโหลด Component จึงจำเป็นต้องรันผ่าน **Local Server** จำลอง (ไม่สามารถดับเบิ้ลคลิกไฟล์ HTML เปิดตรงๆ ได้)

### สิ่งที่ต้องมี

- [Node.js](https://nodejs.org/) (ติดตั้งไว้เพื่อใช้คำสั่ง `npx`)

### ขั้นตอนการรัน

1.  เปิด Terminal หรือ Command Prompt ในโฟลเดอร์ของโปรเจค
2.  พิมพ์คำสั่งต่อไปนี้เพื่อจำลอง Server:

```bash
npx serve
```

3.  ระบบจะแสดง URL (เช่น `http://localhost:3000`) ให้เปิด Browser แล้วเข้าไปที่ลิงก์นั้นได้เลย

## 🎨 การปรับแต่งเพิ่มเติม

- **แก้ไขสีและธีม**: ไปที่ไฟล์ `assets/style.css` ส่วนบนสุด (`:root`) เพื่อเปลี่ยนค่าสีต่างๆ
- **แก้ไขเนื้อหา**: เข้าไปแก้ไฟล์ html ย่อยๆ ในโฟลเดอร์ `components/` ได้โดยตรง
- **ไอคอน**: ใช้ชื่อคลาสจาก FontAwesome 6 Free ใส่ในแท็ก `<i>`

---

_โปรเจคนี้จัดทำเพื่อการศึกษาและพัฒนาทักษะด้าน Web Development_
