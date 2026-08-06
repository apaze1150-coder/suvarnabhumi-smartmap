---
name: version-control
description: ใช้สำหรับการจัดการ Version Control ด้วย Git อย่างปลอดภัย ช่วยสร้าง Checkpoint, Commit งานอย่างมีมาตรฐาน, จัดการ Branch และย้อนกลับ (Rollback) เมื่อพบข้อผิดพลาด
---

# Version Control Skill Instructions (Git Guidelines)

ในฐานะที่คุณเป็นผู้เชี่ยวชาญด้าน Git และ Version Control ให้ปฏิบัติตามหลักการและขั้นตอนต่อไปนี้เพื่อรักษาความปลอดภัยของโค้ดในโปรเจกต์:

## 1. Safety-First Rule (กฎความปลอดภัยสูงสุด)
* **สร้าง Checkpoint ก่อนแก้โค้ดเสมอ:** ก่อนเริ่มแก้ไขไฟล์ ปรับปรุง UI หรือ refactor โค้ดตามคำสั่งผู้ใช้ ให้ตรวจสอบสถานะ Git ก่อนเสมอ (`git status`)
* หากมีโค้ดที่ทำงานได้ดีแต่ยังไม่ได้ commit ให้ทำการ commit หรือ stash เก็บไว้ก่อนเริ่มงานใหม่ทุกครั้ง
* **ห้ามใช้คำสั่งอันตรายเด็ดขาด:** ห้ามรันคำสั่ง `git reset --hard` หรือ `git clean -fd` โดยไม่ได้รับอนุญาตชัดเจนจากผู้ใช้

## 2. Commit Message Standard
เมื่อทำการ Commit งาน ให้ใช้รูปแบบ **Conventional Commits** เป็นภาษาไทยหรืออังกฤษที่อ่านเข้าใจง่าย เช่น:
* `feat:` สำหรับการเพิ่มฟีเจอร์ใหม่ (เช่น `feat: add flight search component`)
* `fix:` สำหรับการแก้ไข Bug (เช่น `fix: resolve supabase connection timeout`)
* `style:` สำหรับการปรับแต่ง UI/CSS โดยไม่กระทบ Logic (เช่น `style: adjust layout spacing on index.html`)
* `refactor:` สำหรับการจัดโครงสร้างโค้ดใหม่ (เช่น `refactor: merge smartmap logic into main index`)
* `chore:` สำหรับงานอัปเดตไฟล์คอนฟิก/Skill (เช่น `chore: add version control skill`)

## 3. Workflow ขั้นตอนการทำงาน
เมื่อผู้ใช้สั่งให้เริ่มงานใหม่หรือแก้ไขโค้ด:
1. **Check Status:** เช็กสถานะไฟล์ปัจจุบันด้วย `git status`
2. **Auto-Save Checkpoint:** ถ้ามีงานค้าง ให้สั่ง commit ด้วยข้อความเช่น `chore: save working checkpoint before [งานใหม่]`
3. **Execute Task:** ทำการแก้ไขโค้ดตามที่ผู้ใช้มอบหมาย
4. **Verify & Commit:** เมื่อแก้ไขเสร็จและตรวจสอบว่าไม่มี error ให้ทำ `git add .` และ commit งานนั้นทันที

## 4. Emergency Rollback (การย้อนกลับเมื่อระบบพัง)
หากผู้ใช้แจ้งว่าระบบพังหรือต้องการย้อนกลับ:
* ให้ใช้คำสั่ง `git log -n 5 --oneline` เพื่อดูประวัติล่าสุด
* แนะนำทางเลือกการย้อนกลับ เช่น `git checkout -- [file]` สำหรับย้อนเฉพาะไฟล์ หรือ `git revert [commit_id]` เพื่อย้อนกลับอย่างปลอดภัยโดยไม่เสียประวัติ