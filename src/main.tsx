import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  FileDown,
  FileText,
  GraduationCap,
  Landmark,
  Layers,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  LogOut,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  NotebookPen,
  Plus,
  Printer,
  Quote,
  Rocket,
  School,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  UserRound,
  Users,
  UsersRound,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/* ------------------------------------------------------------------ */
/* Helpers & hooks                                                     */
/* ------------------------------------------------------------------ */

const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ')

const AUTH_KEY = 'siap-guru-auth'

function isSignedIn() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

function setSignedIn(v: boolean) {
  try {
    localStorage.setItem(AUTH_KEY, String(v))
  } catch {
    /* ignore */
  }
}

function useTheme() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )
  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem('siap-guru-theme', next ? 'dark' : 'light')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])
  return { dark, toggle }
}

function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Mode terang' : 'Mode gelap'}
      className={cx(
        'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
        className,
      )}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cx(
          'flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white',
          size === 'md' ? 'h-10 w-10' : 'h-9 w-9',
        )}
      >
        <GraduationCap className={size === 'md' ? 'h-5 w-5' : 'h-5 w-5'} />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          Siap Guru
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Merdeka
        </span>
      </span>
    </span>
  )
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

/* ------------------------------------------------------------------ */
/* Shared data                                                         */
/* ------------------------------------------------------------------ */

type Module = {
  icon: typeof Target
  title: string
  desc: string
  progress: number
  chip: string
  iconWrap: string
  bar: string
}

const MODULES: Module[] = [
  {
    icon: Target,
    title: 'CP & Analisis',
    desc: 'Ingesti CP, klasifikasi elemen & ekstraksi KKO',
    progress: 100,
    chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    iconWrap: 'bg-indigo-500',
    bar: 'bg-indigo-500',
  },
  {
    icon: ListChecks,
    title: 'TP & ATP',
    desc: 'Alur tujuan pembelajaran + sekuensing DAG',
    progress: 85,
    chip: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
    iconWrap: 'bg-violet-500',
    bar: 'bg-violet-500',
  },
  {
    icon: BarChart3,
    title: 'KKTP',
    desc: 'Interval & matriks ketuntasan per TP',
    progress: 70,
    chip: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300',
    iconWrap: 'bg-cyan-500',
    bar: 'bg-cyan-500',
  },
  {
    icon: NotebookPen,
    title: 'PPM / RPP',
    desc: 'Perencanaan pembelajaran blok 8-3-3-4',
    progress: 60,
    chip: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
    iconWrap: 'bg-teal-500',
    bar: 'bg-teal-500',
  },
  {
    icon: FileText,
    title: 'LKPD & Bahan Ajar',
    desc: 'Lampiran LKPD, media & bahan ajar',
    progress: 45,
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    iconWrap: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
  {
    icon: UsersRound,
    title: 'Rombel & Siswa',
    desc: 'Data rombongan belajar & peserta didik',
    progress: 100,
    chip: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    iconWrap: 'bg-sky-500',
    bar: 'bg-sky-500',
  },
  {
    icon: CalendarCheck,
    title: 'Presensi & Jurnal',
    desc: 'Absensi harian & jurnal mengajar',
    progress: 80,
    chip: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    iconWrap: 'bg-orange-500',
    bar: 'bg-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Nilai & Analisis',
    desc: 'Tugas, UH, UTS, UAS & praktik',
    progress: 65,
    chip: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    iconWrap: 'bg-rose-500',
    bar: 'bg-rose-500',
  },
  {
    icon: Printer,
    title: 'Pusat Cetak',
    desc: 'Cetak & ekspor dokumen administrasi',
    progress: 50,
    chip: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300',
    iconWrap: 'bg-fuchsia-500',
    bar: 'bg-fuchsia-500',
  },
  {
    icon: ShieldCheck,
    title: 'Supervisi Kepsek',
    desc: 'Matriks kelayakan berkas pendidik',
    progress: 40,
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300',
    iconWrap: 'bg-slate-500',
    bar: 'bg-slate-500',
  },
]

const PIPELINE_STEPS = [
  {
    icon: FileText,
    step: '01',
    title: 'Ingesti CP',
    desc: 'Tempel teks Capaian Pembelajaran, sistem mengelompokkan elemen sesuai kamus mapel.',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Ekstraksi KKO',
    desc: 'Kalimat CP dibedah menjadi Kompetensi (Bloom C1–C6) dan Ruang Lingkup Materi.',
  },
  {
    icon: Lightbulb,
    step: '03',
    title: 'Generasi TP',
    desc: 'Formula Kompetensi + Konten + Variasi Konteks Nyata menghasilkan TP yang utuh.',
  },
  {
    icon: Layers,
    step: '04',
    title: 'Sekuensing DAG',
    desc: 'Urutan elemen mudah → sulit (scaffolding) tersusun otomatis berbasis ketergantungan.',
  },
  {
    icon: CalendarDays,
    step: '05',
    title: 'Semester Split',
    desc: 'Pembagian JP riil 18 minggu efektif dengan load balancing deviasi maksimal ±4 JP.',
  },
  {
    icon: Printer,
    step: '06',
    title: 'Cetak Dokumen',
    desc: 'ATP, KKTP, PPM dan administrasi kelas siap dicetak & diekspor dalam satu klik.',
  },
]

const ROLES = [
  {
    icon: UserRound,
    title: 'Guru',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    desc: '10 modul administrasi pembelajaran: CP, TP, ATP, KKTP, PPM, LKPD, presensi, nilai hingga cetak dokumen.',
    points: ['Generator ATP otomatis', 'Matriks KKTP per TP', 'Rekap nilai & analisis'],
  },
  {
    icon: Award,
    title: 'Kepala Sekolah',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    desc: 'Panel pengawasan lengkap dengan matriks kelayakan berkas seluruh pendidik secara realtime.',
    points: ['Supervisi berkas digital', 'Matriks kelayakan 10 modul', 'Rekap per pendidik'],
  },
  {
    icon: Landmark,
    title: 'Admin Sekolah',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    desc: 'Data master terpusat: guru, rombel, siswa, mata pelajaran dan Fase A–F Kurikulum Merdeka.',
    points: ['Master mapel & fase', 'Manajemen pengguna', 'Rekap seluruh sekolah'],
  },
]

const TESTIMONIALS = [
  {
    quote:
      'Dulu menyusun ATP butuh berminggu-minggu. Sekarang tinggal tempel CP, semua TP tersusun rapi dan siap cetak. Waktu saya jauh lebih banyak untuk mengajar.',
    name: 'Sari Wulandari',
    role: 'Guru IPA, SDN 1 Cikarang',
    initials: 'SW',
    color: 'bg-indigo-500',
  },
  {
    quote:
      'Matriks kelayakan berkas guru kini bisa dipantau dari satu panel. Supervisi jadi lebih cepat, objektif, dan datanya selalu terbarukan.',
    name: 'Dedi Kurniawan',
    role: 'Kepala Sekolah, SMPN 5 Bandung',
    initials: 'DK',
    color: 'bg-teal-500',
  },
  {
    quote:
      'Presensi, jurnal, dan nilai tersambung dalam satu alur. Rekap untuk rapor tidak lagi dikerjakan tengah malam.',
    name: 'Maya Anggraini',
    role: 'Guru Matematika, SMAN 3 Surabaya',
    initials: 'MA',
    color: 'bg-amber-500',
  },
]

const HERO_STATS = [
  { value: '10', label: 'Modul Lengkap' },
  { value: '1.200+', label: 'Guru Aktif' },
  { value: '48rb+', label: 'Peserta Didik' },
  { value: '5', label: 'Fase A–F' },
]

const NAV_LINKS = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Alur Kerja', href: '#alur' },
  { label: 'Peran', href: '#peran' },
  { label: 'Testimoni', href: '#testimoni' },
]

/* Dashboard data */

const DASH_STATS = [
  { icon: UsersRound, label: 'Rombel Aktif', value: '4', delta: '+1 minggu ini', up: true, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { icon: Users, label: 'Peserta Didik', value: '128', delta: '+3 minggu ini', up: true, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
  { icon: ListChecks, label: 'ATP Tersusun', value: '36/40', delta: '90% selesai', up: true, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  { icon: BarChart3, label: 'Nilai Terisi', value: '82%', delta: '+6% dari bulan lalu', up: true, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  { icon: CheckCircle2, label: 'KKTP Tuntas', value: '78%', delta: '+4% dari bulan lalu', up: true, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { icon: Printer, label: 'Dokumen Tercetak', value: '24', delta: '8 minggu ini', up: true, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
]

const PROGRES_NILAI = [
  { bulan: 'Agu', hadir: 92, rata: 74 },
  { bulan: 'Sep', hadir: 94, rata: 78 },
  { bulan: 'Okt', hadir: 90, rata: 76 },
  { bulan: 'Nov', hadir: 96, rata: 81 },
  { bulan: 'Des', hadir: 95, rata: 84 },
  { bulan: 'Jan', hadir: 98, rata: 86 },
  { bulan: 'Feb', hadir: 97, rata: 88 },
]

const KETUNTASAN_KKTP = [
  { name: 'Tuntas', value: 78, color: '#6366f1' },
  { name: 'Perlu Bimbingan', value: 16, color: '#f59e0b' },
  { name: 'Belum Dinilai', value: 6, color: '#94a3b8' },
]

const NILAI_MAPEL = [
  { mapel: 'IPA', rata: 86 },
  { mapel: 'Matematika', rata: 79 },
  { mapel: 'B. Indonesia', rata: 88 },
  { mapel: 'IPS', rata: 83 },
  { mapel: 'PJOK', rata: 91 },
  { mapel: 'B. Inggris', rata: 81 },
]

const PRESENSI_MINGGU = [
  { hari: 'Sen', hadir: 30, sakit: 1, izin: 1, alpa: 0 },
  { hari: 'Sel', hadir: 29, sakit: 2, izin: 0, alpa: 1 },
  { hari: 'Rab', hadir: 31, sakit: 0, izin: 1, alpa: 0 },
  { hari: 'Kam', hadir: 28, sakit: 1, izin: 2, alpa: 1 },
  { hari: 'Jum', hadir: 30, sakit: 1, izin: 0, alpa: 1 },
  { hari: 'Sab', hadir: 32, sakit: 0, izin: 0, alpa: 0 },
]

const ROMBELS = [
  { nama: 'VII-A', mapel: 'IPA Terpadu', fase: 'Fase D', siswa: 32, kelengkapan: 92, status: 'Lengkap' },
  { nama: 'VII-B', mapel: 'IPA Terpadu', fase: 'Fase D', siswa: 31, kelengkapan: 85, status: 'Hampir' },
  { nama: 'VIII-A', mapel: 'IPA Terpadu', fase: 'Fase D', siswa: 33, kelengkapan: 76, status: 'Proses' },
  { nama: 'IX-A', mapel: 'IPA Terpadu', fase: 'Fase D', siswa: 32, kelengkapan: 68, status: 'Proses' },
]

const AKTIVITAS = [
  { icon: FileCheck2, color: 'bg-violet-500', text: 'ATP IPA VII-A disetujui kepala sekolah', time: '10 menit lalu' },
  { icon: Users, color: 'bg-sky-500', text: '3 siswa baru ditambahkan ke VII-B', time: '1 jam lalu' },
  { icon: BarChart3, color: 'bg-emerald-500', text: 'Nilai UH Matematika VIII-A diinput', time: '3 jam lalu' },
  { icon: Printer, color: 'bg-rose-500', text: 'Dokumen PPM IPA IX-A dicetak', time: 'Kemarin' },
  { icon: ShieldCheck, color: 'bg-amber-500', text: 'Supervisi berkas oleh kepala sekolah', time: '2 hari lalu' },
]

const JADWAL = [
  { hari: 'Senin', waktu: '07.00 – 08.40', kelas: 'VII-A · IPA Terpadu', ruang: 'R. 12' },
  { hari: 'Senin', waktu: '10.00 – 11.40', kelas: 'VII-B · IPA Terpadu', ruang: 'R. 14' },
  { hari: 'Selasa', waktu: '07.00 – 08.40', kelas: 'VIII-A · IPA Terpadu', ruang: 'Lab IPA' },
  { hari: 'Rabu', waktu: '09.00 – 10.40', kelas: 'IX-A · IPA Terpadu', ruang: 'R. 09' },
  { hari: 'Jumat', waktu: '07.00 – 08.40', kelas: 'VII-A · IPA Terpadu', ruang: 'R. 12' },
]

const TP_LIST = [
  { kode: 'TP 1.1', teks: 'Menganalisis struktur dan fungsi sel serta kaitannya dengan kehidupan sehari-hari.', elemen: 'Pemahaman Sains', semester: 'Ganjil', jp: 12, status: 'Tuntas' },
  { kode: 'TP 1.2', teks: 'Membandingkan proses fotosintesis dan respirasi pada tumbuhan melalui percobaan sederhana.', elemen: 'Keterampilan Proses', semester: 'Ganjil', jp: 10, status: 'Tuntas' },
  { kode: 'TP 2.1', teks: 'Menganalisis sistem peredaran darah manusia dan keterkaitannya dengan pola hidup sehat.', elemen: 'Pemahaman Sains', semester: 'Genap', jp: 12, status: 'Proses' },
  { kode: 'TP 2.2', teks: 'Menyajikan karya tentang pemanasan global beserta dampak dan upaya penanggulangannya.', elemen: 'Pemahaman Sains', semester: 'Genap', jp: 10, status: 'Proses' },
  { kode: 'TP 2.3', teks: 'Melakukan penyelidikan tentang komponen ekosistem dan interaksinya di lingkungan sekitar.', elemen: 'Keterampilan Proses', semester: 'Genap', jp: 8, status: 'Draft' },
]

const KKTP_MATRIKS = [
  { tp: 'TP 1.1', interval: '80 – 100', status: 'Tuntas' },
  { tp: 'TP 1.2', interval: '78 – 100', status: 'Tuntas' },
  { tp: 'TP 2.1', interval: '75 – 100', status: 'Perlu Bimbingan' },
  { tp: 'TP 2.2', interval: '80 – 100', status: 'Perlu Bimbingan' },
  { tp: 'TP 2.3', interval: '75 – 100', status: 'Belum Dinilai' },
]

const PPM_LIST = [
  { judul: 'PPM 1 · Struktur dan Fungsi Sel', blok: 'Blok 8 JP', tgl: '12 – 23 Januari', status: 'Siap Cetak' },
  { judul: 'PPM 2 · Fotosintesis & Respirasi', blok: 'Blok 8 JP', tgl: '26 Jan – 6 Feb', status: 'Siap Cetak' },
  { judul: 'PPM 3 · Sistem Peredaran Darah', blok: 'Blok 8 JP', tgl: '9 – 20 Feb', status: 'Disusun' },
  { judul: 'PPM 4 · Ekosistem', blok: 'Blok 8 JP', tgl: '23 Feb – 6 Mar', status: 'Draft' },
]

const LKPD_LIST = [
  { judul: 'LKPD 1 · Pengamatan Sel Bawang Merah', jenis: 'LKPD', tgl: 'Diperbarui 2 hari lalu' },
  { judul: 'Media · Video Fotosintesis Interaktif', jenis: 'Media', tgl: 'Diperbarui minggu lalu' },
  { judul: 'Bahan Ajar · Sistem Peredaran Darah', jenis: 'Bahan Ajar', tgl: 'Diperbarui 3 hari lalu' },
  { judul: 'LKPD 2 · Percobaan Respirasi', jenis: 'LKPD', tgl: 'Draft' },
]

const DOKUMEN_CETAK = [
  { icon: ScrollText, title: 'ATP IPA Kelas VII', sub: 'Alur Tujuan Pembelajaran · Semester Ganjil', pages: '12 hlm' },
  { icon: BarChart3, title: 'Matriks KKTP', sub: 'Interval ketuntasan per TP', pages: '4 hlm' },
  { icon: NotebookPen, title: 'PPM Blok 8-3-3-4', sub: 'Perencanaan pembelajaran lengkap', pages: '28 hlm' },
  { icon: ClipboardList, title: 'Rekap Nilai & Presensi', sub: 'Rekap per rombel · siap rapor', pages: '8 hlm' },
]

const NILAI_TABEL = [
  { siswa: 'Aditya Pratama', tugas: 88, uh: 85, uts: 90, uas: 86, akhir: 87, status: 'Tuntas' },
  { siswa: 'Bunga Lestari', tugas: 92, uh: 90, uts: 94, uas: 91, akhir: 92, status: 'Tuntas' },
  { siswa: 'Citra Ayu', tugas: 78, uh: 74, uts: 80, uas: 76, akhir: 77, status: 'Perlu Bimbingan' },
  { siswa: 'Dimas Saputra', tugas: 84, uh: 80, uts: 82, uas: 88, akhir: 84, status: 'Tuntas' },
  { siswa: 'Eka Ramadhan', tugas: 70, uh: 68, uts: 72, uas: 70, akhir: 70, status: 'Perlu Bimbingan' },
  { siswa: 'Fitri Handayani', tugas: 90, uh: 88, uts: 92, uas: 89, akhir: 90, status: 'Tuntas' },
]

const JURNAL = [
  { tgl: 'Senin, 17 Feb', materi: 'Struktur sel hewan & tumbuhan', rombel: 'VII-A', kehadiran: '30/32' },
  { tgl: 'Senin, 17 Feb', materi: 'Praktikum pengamatan sel', rombel: 'VII-B', kehadiran: '29/31' },
  { tgl: 'Selasa, 18 Feb', materi: 'Sistem peredaran darah', rombel: 'VIII-A', kehadiran: '31/33' },
  { tgl: 'Rabu, 19 Feb', materi: 'Fotosintesis lanjutan', rombel: 'IX-A', kehadiran: '30/32' },
]

/* ------------------------------------------------------------------ */
/* Reusable bits                                                       */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      {label && <p className="mb-1 font-bold text-slate-900 dark:text-white">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name ?? p.dataKey} className="flex items-center gap-2 py-0.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color ?? p.payload?.fill ?? p.payload?.color }}
          />
          {p.name ?? p.dataKey}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

function SectionHeader({
  title,
  desc,
  action,
  onAction,
}: {
  title: string
  desc?: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{title}</h2>
        {desc && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          {action}
        </button>
      )}
    </div>
  )
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    Tuntas: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Lengkap: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    'Perlu Bimbingan': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    Hampir: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    Proses: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    'Belum Dinilai': 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300',
    Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300',
    Disusun: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    'Siap Cetak': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        map[status] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300',
      )}
    >
      {status}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Landing page                                                        */
/* ------------------------------------------------------------------ */

function LandingPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const signedIn = isSignedIn()

  const handleCta = () => {
    if (!signedIn) {
      setSignedIn(true)
      toast.success('Berhasil masuk (mode demo)', { description: 'Selamat datang, Bu Sari! 👋' })
    }
    navigate('/dashboard')
  }

  const ctaLabel = signedIn ? 'Buka Dashboard' : 'Mulai Gratis'

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Latar dekoratif */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute top-40 left-[-12%] h-[420px] w-[420px] rounded-full bg-teal-500/15 blur-3xl dark:bg-teal-500/15" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="cursor-pointer">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="cursor-pointer text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleCta}
              className="hidden cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 sm:inline-flex"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950 md:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    {l.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={handleCta}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Sistem Perangkat Ajar Digital Kurikulum Merdeka
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              Perangkat Ajar Merdeka,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
                Selesai Sekali Klik
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              Dari CP, TP, ATP, KKTP, PPM hingga rekap nilai dan cetak dokumen — Siap Guru
              menyusun seluruh administrasi pembelajaran Kurikulum Merdeka secara otomatis,
              efisien, dan siap cetak.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCta}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 active:scale-[0.98]"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#alur"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Lihat Alur Kerja
              </a>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
            >
              {['Tanpa kunci API', '100% deterministik', 'Gratis untuk guru'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual hero */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Dashboard Guru
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { l: 'ATP Tersusun', v: '36/40', c: 'text-indigo-600 dark:text-indigo-400' },
                  { l: 'KKTP Tuntas', v: '78%', c: 'text-teal-600 dark:text-teal-400' },
                  { l: 'Nilai Terisi', v: '82%', c: 'text-violet-600 dark:text-violet-400' },
                  { l: 'Dokumen Cetak', v: '24', c: 'text-amber-600 dark:text-amber-400' },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{s.l}</p>
                    <p className={cx('mt-1 text-xl font-extrabold tracking-tight', s.c)}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  { l: 'CP & Analisis', w: '100%' },
                  { l: 'TP & ATP', w: '85%' },
                  { l: 'KKTP', w: '70%' },
                  { l: 'PPM / RPP', w: '60%' },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>{b.l}</span>
                      <span>{b.w}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: b.w }}
                        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -right-2 -top-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900 sm:-right-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">ATP Disetujui</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">oleh Kepala Sekolah</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900 sm:-left-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">+6% Ketuntasan</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">dibanding bulan lalu</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Statistik */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:grid-cols-4"
        >
          {HERO_STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
          >
            10 Modul Lengkap
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Satu ruang kerja untuk seluruh administrasi mengajar
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-slate-600 dark:text-slate-300"
          >
            Setiap modul saling terhubung — dari perencanaan kurikulum hingga dokumen siap cetak.
          </motion.p>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MODULES.map((m) => (
            <motion.div
              key={m.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
            >
              <div className="flex items-start justify-between">
                <span
                  className={cx(
                    'flex h-11 w-11 items-center justify-center rounded-xl text-white',
                    m.iconWrap,
                  )}
                >
                  <m.icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {m.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{m.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Alur kerja */}
      <section
        id="alur"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400"
          >
            Pipeline Generator Kurikulum
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Dari CP menjadi ATP siap cetak
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-slate-600 dark:text-slate-300">
            Mesin deterministik tanpa kunci API: tempel teks CP, biarkan sistem menyusun sisanya.
          </motion.p>
        </motion.div>
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent dark:via-indigo-500/40 lg:block" />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PIPELINE_STEPS.map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="relative">
                <div className="relative z-10 flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-200 bg-white text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-900 dark:text-indigo-300">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight text-slate-200 dark:text-slate-800">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Peran */}
      <section id="peran" className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400"
          >
            Untuk Seluruh Ekosistem Sekolah
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Ruang kerja sesuai peranmu
          </motion.h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {ROLES.map((r) => (
            <motion.div
              key={r.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className={cx('flex h-12 w-12 items-center justify-center rounded-xl', r.bg, r.color)}>
                <r.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{r.desc}</p>
              <ul className="mt-4 space-y-2">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimoni */}
      <section
        id="testimoni"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400"
          >
            Kata Mereka
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Dipercaya pendidik di seluruh Indonesia
          </motion.h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <Quote className="h-6 w-6 text-indigo-300 dark:text-indigo-500/50" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                “{t.quote}”
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <span
                  className={cx(
                    'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white',
                    t.color,
                  )}
                >
                  {t.initials}
                </span>
                <div>
                  <figcaption className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</figcaption>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-600 p-8 text-center sm:p-14"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-teal-300/20 blur-2xl" />
          <Rocket className="mx-auto h-10 w-10 text-white/90" />
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Susun perangkat ajar Merdeka hari ini
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-indigo-100 sm:text-base">
            Bergabung dengan ribuan guru yang menghemat waktu administrasi dan fokus kembali pada pembelajaran.
          </p>
          <button
            type="button"
            onClick={handleCta}
            className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 transition-all hover:bg-indigo-50 active:scale-[0.98]"
          >
            {signedIn ? 'Buka Dashboard' : 'Mulai Gratis Sekarang'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          <Link to="/" className="cursor-pointer">
            <Logo />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="cursor-pointer hover:text-slate-900 dark:hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <School className="h-4 w-4" />
            Siap Guru · Kurikulum Merdeka
          </p>
        </div>
        <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400 dark:border-slate-800/70 dark:text-slate-500">
          © {new Date().getFullYear()} Siap Guru Merdeka — Sistem Perangkat Ajar Digital. Dibuat untuk pendidik Indonesia 🇮🇩
        </div>
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

type SectionKey =
  | 'ringkasan'
  | 'atp'
  | 'kktp'
  | 'ppm'
  | 'lkpd'
  | 'rombel'
  | 'presensi'
  | 'nilai'
  | 'cetak'
  | 'pengaturan'

type Role = 'guru' | 'kepsek' | 'admin'

const NAV_GROUPS: { label: string; items: { key: SectionKey; label: string; icon: typeof Target }[] }[] = [
  {
    label: 'Utama',
    items: [{ key: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard }],
  },
  {
    label: 'Perangkat Ajar',
    items: [
      { key: 'atp', label: 'CP, TP & ATP', icon: Target },
      { key: 'kktp', label: 'KKTP', icon: BarChart3 },
      { key: 'ppm', label: 'PPM / RPP', icon: NotebookPen },
      { key: 'lkpd', label: 'LKPD & Bahan Ajar', icon: FileText },
    ],
  },
  {
    label: 'Data Mengajar',
    items: [
      { key: 'rombel', label: 'Rombel & Siswa', icon: UsersRound },
      { key: 'presensi', label: 'Presensi & Jurnal', icon: CalendarCheck },
      { key: 'nilai', label: 'Nilai & Analisis', icon: TrendingUp },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { key: 'cetak', label: 'Pusat Dokumen & Cetak', icon: Printer },
      { key: 'pengaturan', label: 'Pengaturan', icon: Settings },
    ],
  },
]

const ROLE_LABEL: Record<Role, string> = {
  guru: 'Guru',
  kepsek: 'Kepala Sekolah',
  admin: 'Admin',
}

function SidebarContent({
  active,
  onSelect,
  role,
  setRole,
  onClose,
}: {
  active: SectionKey
  onSelect: (k: SectionKey) => void
  role: Role
  setRole: (r: Role) => void
  onClose?: () => void
}) {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-800">
        <Link to="/" onClick={onClose} className="cursor-pointer">
          <Logo size="sm" />
        </Link>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {g.label}
            </p>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const isActive = active === item.key
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      onSelect(item.key)
                      onClose?.()
                    }}
                    className={cx(
                      'flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white',
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <label className="mb-1.5 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Mode Demo
        </label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="guru">Guru</option>
            <option value="kepsek">Kepala Sekolah</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setSignedIn(false)
            toast('Kamu telah keluar dari sesi demo')
            navigate('/')
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Keluar
        </button>
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [section, setSection] = useState<SectionKey>('ringkasan')
  const [role, setRole] = useState<Role>('guru')
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isSignedIn()) {
    return <Navigate to="/" replace />
  }

  const userName = role === 'guru' ? 'Bu Sari' : role === 'kepsek' ? 'Pak Dedi' : 'Admin Sekolah'

  const renderSection = () => {
    switch (section) {
      case 'ringkasan':
        return <OverviewSection role={role} onNavigate={setSection} />
      case 'atp':
        return <AtpSection />
      case 'kktp':
        return <KktpSection />
      case 'ppm':
        return <PpmSection />
      case 'lkpd':
        return <LkpdSection />
      case 'rombel':
        return <RombelSection />
      case 'presensi':
        return <PresensiSection />
      case 'nilai':
        return <NilaiSection />
      case 'cetak':
        return <CetakSection />
      case 'pengaturan':
        return <SettingsSection role={role} setRole={setRole} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        <SidebarContent active={section} onSelect={setSection} role={role} setRole={setRole} />
      </aside>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden"
            >
              <SidebarContent
                active={section}
                onSelect={setSection}
                role={role}
                setRole={setRole}
                onClose={() => setMenuOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Konten */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari modul, rombel, siswa…"
                className="w-64 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 lg:w-80"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Notifikasi"
                onClick={() => toast('Tidak ada notifikasi baru 🎉')}
                className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>
              <ThemeToggle />
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-teal-500 text-[11px] font-bold text-white">
                  {userName.split(' ').map((w) => w[0]).join('')}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-bold leading-tight text-slate-900 dark:text-white">
                    {userName}
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400">{ROLE_LABEL[role]}</span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: Ringkasan ---------------- */

function OverviewSection({ role, onNavigate }: { role: Role; onNavigate: (s: SectionKey) => void }) {
  return (
    <div className="space-y-8">
      {/* Sapaan */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Halo, {role === 'guru' ? 'Bu Sari' : role === 'kepsek' ? 'Pak Dedi' : 'Admin'} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {role === 'guru' && 'Berikut ringkasan perangkat ajar IPA Terpadu minggu ini.'}
            {role === 'kepsek' && 'Pantau kelayakan berkas pendidik di sekolah Anda.'}
            {role === 'admin' && 'Rekap data master dan seluruh sekolah Anda.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Membuat ATP baru… ✨')}
          className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Buat ATP Baru
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {DASH_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className={cx('flex h-9 w-9 items-center justify-center rounded-xl', s.bg, s.color)}>
              <s.icon className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">{s.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              {s.delta}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Grafik */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Progres Kehadiran & Rata-rata Nilai
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">7 bulan terakhir · semua rombel</p>
            </div>
            <span className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Kehadiran
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> Rata-rata
              </span>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={PROGRES_NILAI} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gHadir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
              <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="hadir" name="Kehadiran" stroke="#6366f1" strokeWidth={2.5} fill="url(#gHadir)" />
              <Area type="monotone" dataKey="rata" name="Rata-rata" stroke="#14b8a6" strokeWidth={2.5} fill="transparent" strokeDasharray="6 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Ketuntasan KKTP</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Per TP · semester ini</p>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={KETUNTASAN_KKTP} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {KETUNTASAN_KKTP.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {KETUNTASAN_KKTP.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modul + aktivitas + jadwal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Progres Modul Perangkat Ajar</h2>
            <button
              type="button"
              onClick={() => onNavigate('cetak')}
              className="cursor-pointer text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Lihat semua
            </button>
          </div>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {MODULES.map((m) => (
              <div key={m.title}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                    <m.icon className="h-4 w-4 text-slate-400" />
                    {m.title}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{m.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={cx('h-full rounded-full', m.bar)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Aktivitas Terbaru</h2>
          <div className="mt-4 space-y-4">
            {AKTIVITAS.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={cx('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white', a.color)}>
                  <a.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-slate-700 dark:text-slate-200">{a.text}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jadwal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Jadwal Mengajar</h2>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            Pekan ini
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {JADWAL.map((j) => (
            <div key={`${j.hari}-${j.waktu}`} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{j.hari}</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{j.waktu}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{j.kelas}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="h-3 w-3" />
                {j.ruang}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: CP, TP & ATP ---------------- */

function AtpSection() {
  return (
    <div>
      <SectionHeader
        title="CP, TP & ATP"
        desc="Alur Tujuan Pembelajaran IPA Terpadu · Fase D"
        action="Buat TP"
        onAction={() => toast('Asisten pembuatan TP akan membantumu ✨')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total TP', value: '40', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Semester Ganjil', value: '21', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
          { label: 'Semester Genap', value: '19', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className={cx('inline-flex rounded-lg px-2 py-1 text-[11px] font-bold', s.bg, s.color)}>{s.label}</span>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Daftar Tujuan Pembelajaran</h3>
          <button
            type="button"
            onClick={() => toast('Mengekspor ATP ke PDF… 📄')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FileDown className="h-3.5 w-3.5" />
            Ekspor
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {TP_LIST.map((tp) => (
            <div key={tp.kode} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {tp.kode}
              </span>
              <p className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{tp.teks}</p>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">{tp.elemen}</span>
                <span className={cx(
                  'rounded-full px-2.5 py-1 text-[11px] font-bold',
                  tp.semester === 'Ganjil'
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                    : 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
                )}>
                  {tp.semester}
                </span>
                <span className="text-[11px] font-bold text-slate-400">{tp.jp} JP</span>
                <StatusChip status={tp.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: KKTP ---------------- */

function KktpSection() {
  return (
    <div>
      <SectionHeader
        title="KKTP"
        desc="Interval & matriks ketuntasan per TP"
        action="Atur KKTP"
        onAction={() => toast('Pengaturan KKTP dibuka 🔧')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Interval Utama', value: '75 – 100', sub: 'Kriteria Ketercapaian TP' },
          { label: 'TP Tuntas', value: '78%', sub: 'di atas interval utama' },
          { label: 'Perlu Bimbingan', value: '16%', sub: 'intervensi & remedial' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Matriks Ketuntasan per TP</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-5 py-3">TP</th>
                <th className="px-5 py-3">Interval Nilai</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {KKTP_MATRIKS.map((k) => (
                <tr key={k.tp} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{k.tp}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{k.interval}</td>
                  <td className="px-5 py-3.5"><StatusChip status={k.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: PPM / RPP ---------------- */

function PpmSection() {
  return (
    <div>
      <SectionHeader
        title="PPM / RPP"
        desc="Perencanaan pembelajaran model blok 8-3-3-4"
        action="Buat PPM"
        onAction={() => toast('Membuat PPM baru… 🗂️')}
      />
      <div className="grid gap-4 sm:grid-cols-4">
        {['Pendahuluan (8 JP)', 'Inti 1 (3 JP)', 'Inti 2 (3 JP)', 'Penutup (4 JP)'].map((b, i) => (
          <div key={b} className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900">
            <span className={cx(
              'mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-white',
              ['bg-indigo-500', 'bg-violet-500', 'bg-teal-500', 'bg-amber-500'][i],
            )}>
              {['1', '2', '3', '4'][i]}
            </span>
            <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {PPM_LIST.map((p) => (
          <div
            key={p.judul}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{p.judul}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{p.tgl}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{p.blok}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusChip status={p.status} />
              <button
                type="button"
                onClick={() => toast(`Membuka ${p.judul}…`)}
                className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Buka
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Dashboard: LKPD ---------------- */

function LkpdSection() {
  const jenisStyle: Record<string, string> = {
    LKPD: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    Media: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
    'Bahan Ajar': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  }
  return (
    <div>
      <SectionHeader
        title="LKPD & Bahan Ajar"
        desc="Lampiran LKPD, media pembelajaran & bahan ajar"
        action="Unggah"
        onAction={() => toast('Pilih berkas LKPD untuk diunggah 📎')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {LKPD_LIST.map((l) => (
          <div
            key={l.judul}
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{l.judul}</p>
                <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-bold', jenisStyle[l.jenis])}>{l.jenis}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-400">{l.tgl}</p>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => toast('Membuka berkas… 📂')}
                  className="cursor-pointer rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                >
                  Buka
                </button>
                <button
                  type="button"
                  onClick={() => toast('Berkas diunduh ⬇️')}
                  className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Unduh
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Dashboard: Rombel & Siswa ---------------- */

function RombelSection() {
  return (
    <div>
      <SectionHeader
        title="Rombel & Siswa"
        desc="Data rombongan belajar & peserta didik"
        action="Tambah Rombel"
        onAction={() => toast('Formulir rombel baru dibuka 👥')}
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-5 py-3.5">Rombel</th>
                <th className="px-5 py-3.5">Mapel</th>
                <th className="px-5 py-3.5">Fase</th>
                <th className="px-5 py-3.5">Siswa</th>
                <th className="px-5 py-3.5">Kelengkapan Berkas</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROMBELS.map((r) => (
                <tr key={r.nama} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{r.nama}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{r.mapel}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{r.fase}</span></td>
                  <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-300">{r.siswa} siswa</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className={cx('h-full rounded-full', r.kelengkapan >= 85 ? 'bg-emerald-500' : r.kelengkapan >= 75 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${r.kelengkapan}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{r.kelengkapan}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusChip status={r.status} /></td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toast(`Membuka ${r.nama}…`)}
                      aria-label={`Buka ${r.nama}`}
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: Presensi & Jurnal ---------------- */

function PresensiSection() {
  return (
    <div>
      <SectionHeader
        title="Presensi & Jurnal"
        desc="Absensi harian & jurnal mengajar"
        action="Isi Presensi"
        onAction={() => toast('Form presensi hari ini dibuka 📋')}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Kehadiran Minggu Ini · VII-A</h3>
            <span className="text-xs font-semibold text-slate-400">32 siswa</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PRESENSI_MINGGU} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
              <XAxis dataKey="hari" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
              <Bar dataKey="hadir" name="Hadir" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="sakit" name="Sakit" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="izin" name="Izin" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="alpa" name="Alpa" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Rekap Bulan Ini</h3>
          <div className="mt-4 space-y-3">
            {[
              { l: 'Hadir', v: '94,2%', c: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { l: 'Sakit', v: '2,3%', c: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
              { l: 'Izin', v: '2,1%', c: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
              { l: 'Alpa', v: '1,4%', c: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{s.l}</span>
                <span className={cx('rounded-full px-2.5 py-1 text-xs font-bold', s.bg, s.c)}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Jurnal Mengajar</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {JURNAL.map((j) => (
            <div key={`${j.tgl}-${j.rombel}`} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center">
              <p className="w-40 shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">{j.tgl}</p>
              <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">{j.materi}</p>
              <p className="shrink-0 text-xs font-bold text-slate-400">{j.rombel}</p>
              <p className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Hadir {j.kehadiran}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: Nilai & Analisis ---------------- */

function NilaiSection() {
  return (
    <div>
      <SectionHeader
        title="Nilai & Analisis"
        desc="Tugas, UH, UTS, UAS & praktik · VII-A"
        action="Input Nilai"
        onAction={() => toast('Form input nilai dibuka 🎯')}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-bold tracking-tight text-slate-900 dark:text-white">Rata-rata Nilai per Mata Pelajaran</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={NILAI_MAPEL} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
            <XAxis dataKey="mapel" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
            <Bar dataKey="rata" name="Rata-rata" fill="#14b8a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-5 py-3.5">Siswa</th>
                <th className="px-5 py-3.5">Tugas</th>
                <th className="px-5 py-3.5">UH</th>
                <th className="px-5 py-3.5">UTS</th>
                <th className="px-5 py-3.5">UAS</th>
                <th className="px-5 py-3.5">Akhir</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {NILAI_TABEL.map((n) => (
                <tr key={n.siswa} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{n.siswa}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{n.tugas}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{n.uh}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{n.uts}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{n.uas}</td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-900 dark:text-white">{n.akhir}</td>
                  <td className="px-5 py-3.5"><StatusChip status={n.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: Pusat Dokumen & Cetak ---------------- */

function CetakSection() {
  return (
    <div>
      <SectionHeader
        title="Pusat Dokumen & Cetak"
        desc="Ekspor seluruh administrasi dalam satu klik"
        action="Cetak Semua"
        onAction={() => toast('Menggabungkan semua dokumen untuk dicetak 🖨️')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {DOKUMEN_CETAK.map((d) => (
          <div
            key={d.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <d.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{d.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">{d.sub}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-300 dark:text-slate-500">{d.pages}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 sm:mt-0">
              <button
                type="button"
                onClick={() => toast(`Mencetak ${d.title}… 🖨️`)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <Printer className="h-3.5 w-3.5" />
                Cetak
              </button>
              <button
                type="button"
                onClick={() => toast(`${d.title} diunduh ⬇️`)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FileDown className="h-3.5 w-3.5" />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <div className="flex items-start gap-3">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm font-bold tracking-tight text-indigo-900 dark:text-indigo-200">
              Semua berkas tersusun otomatis
            </p>
            <p className="mt-1 text-xs leading-relaxed text-indigo-700/80 dark:text-indigo-300/80">
              ATP, KKTP, PPM, rekap nilai, dan presensi digabungkan menjadi satu paket administrasi
              lengkap sesuai struktur Kurikulum Merdeka — siap diserahkan ke kepala sekolah.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard: Pengaturan ---------------- */

function SettingsSection({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div>
      <SectionHeader title="Pengaturan" desc="Profil, instansi & preferensi akun" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-xl font-extrabold text-white">
              {role === 'guru' ? 'SW' : role === 'kepsek' ? 'DK' : 'AS'}
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {role === 'guru' ? 'Sari Wulandari' : role === 'kepsek' ? 'Dedi Kurniawan' : 'Andi Saputra'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{ROLE_LABEL[role]} · {role === 'guru' ? 'SDN 1 Cikarang' : role === 'kepsek' ? 'SMPN 5 Bandung' : 'Dinas Pendidikan'}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Nama Lengkap', value: role === 'guru' ? 'Sari Wulandari, S.Pd.' : role === 'kepsek' ? 'Dedi Kurniawan, M.Pd.' : 'Andi Saputra' },
              { label: 'NIP / NUPTK', value: '1987123456789012' },
              { label: 'Instansi', value: role === 'guru' ? 'SDN 1 Cikarang' : role === 'kepsek' ? 'SMPN 5 Bandung' : 'Dinas Pendidikan' },
              { label: 'Email', value: role === 'guru' ? 'sari.wulandari@sekolah.id' : role === 'kepsek' ? 'dedi.k@sekolah.id' : 'admin@sekolah.id' },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Mata Pelajaran</label>
            <div className="flex flex-wrap gap-2">
              {['IPA Terpadu', 'Matematika', 'Bahasa Indonesia'].map((m) => (
                <span
                  key={m}
                  className={cx(
                    'cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold',
                    m === 'IPA Terpadu'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                  )}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => toast('Perubahan dibatalkan')}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => toast.success('Profil berhasil disimpan', { description: 'Perubahan langsung berlaku.' })}
              className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
            >
              Simpan
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Peran & Hak Akses</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pilih peran untuk melihat tampilan sesuai RBAC.
            </p>
            <div className="mt-4 space-y-2">
              {(['guru', 'kepsek', 'admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r)
                    toast(`Mode ${ROLE_LABEL[r]} aktif`, { description: 'Tampilan diperbarui sesuai peran.' })
                  }}
                  className={cx(
                    'flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition-colors',
                    role === r
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  {ROLE_LABEL[r]}
                  {role === r && <CheckCircle2 className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Keamanan</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Sesi demo tersimpan di perangkat ini.</p>
            <button
              type="button"
              onClick={() => {
                setSignedIn(false)
                toast('Kamu telah keluar dari sesi demo')
              }}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              Keluar dari Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* App & mount                                                         */
/* ------------------------------------------------------------------ */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
