import dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://sipd.kemendagri.go.id/penatausahaan"
const BASE_API = "https://service.sipd.kemendagri.go.id"
const PATH_DPA = process.env.PATH_DPA
const JADWAL = process.env.JADWAL
const TOKEN = process.env.TOKEN
const TAHUN = process.env.TAHUN
const SUFFIX = `- ${TAHUN} - DPA ${process.env.SUFFIX_DPA}`

interface LAPORAN_DPA {
  PERSETUJUAN: string,
  SKPD: string,
  PENDAPATAN: string,
  BELANJA: string,
  RINCIAN_BELANJA: string,
  PEMBIAYAAN: string,
}
interface URL {
  BASE: {
    HOME: string
    LOGIN: string
  }
  API: {
    JADWAL: string
    TIM_TAPD: string,
    LAPORAN_DPA: LAPORAN_DPA,
    PENDAPATAN: string
  }
}

interface PATH {
  DPA: {
    UTAMA: string
    PERSETUJUAN: string
    DEPAN: string
    SKPD: string
    PENDAPATAN: string
    BELANJA: string
    RINCIAN_BELANJA: string
    PEMBIAYAAN: string
  },
  JSON: {
    UTAMA: string
    PERSETUJUAN: string
    DEPAN: string
    SKPD: string
    PENDAPATAN: string
    BELANJA: string
    RINCIAN_BELANJA: string
    PEMBIAYAAN: string
  }
}

interface Config {
  URL: URL
  PATH: PATH
  TOKEN: string | undefined
  TAHUN: string | undefined
  JADWAL: string | undefined
  SUFFIX: string | undefined
}

const config: Config = {
  URL: {
    BASE: {
      HOME: BASE_URL,
      LOGIN: `${BASE_URL}/login`,
    },
    API: {
      JADWAL: `${BASE_API}/referensi/strict/laporan/dpa/dpa/jadwal-pergeseran`,
      TIM_TAPD: `${BASE_API}/referensi/strict/tim-tapd/list`,

      PERSETUJUAN: `${BASE_API}/referensi/strict/laporan/dpa/dpa/halaman-persetujuan`, //idskpd/idjadwal, persetujuan dan depan ini sama cuma beda waktu tampilkan htmlnya/report aja
      SKPD: `${BASE_API}/referensi/strict/laporan/dpa/dpa/skpd`, //idskpd/idjadwal

      RINCIAN_BELANJA: `${BASE_API}/referensi/strict/laporan/dpa/dpa/rincian-belanja`,
    },
  },
  PATH: {
    DPA: {
      UTAMA: `${PATH_DPA}\\${JADWAL}`,
      DEPAN: `${PATH_DPA}\\${JADWAL}\\1. Halaman Depan`,
      PERSETUJUAN: `${PATH_DPA}\\${JADWAL}\\2. Halaman Persetujuan`,
      SKPD: `${PATH_DPA}\\${JADWAL}\\3. DPA SKPD`,
      PENDAPATAN: `${PATH_DPA}\\${JADWAL}\\4. DPA Pendapatan`,
      BELANJA: `${PATH_DPA}\\${JADWAL}\\5. DPA Belanja`,
      RINCIAN_BELANJA: `${PATH_DPA}\\${JADWAL}\\6. DPA Rincian Belanja`,
      PEMBIAYAAN: `${PATH_DPA}\\${JADWAL}\\7. Pembiayaan`,
    },
    JSON: {
      UTAMA: `${PATH_DPA}\\${JADWAL}\\JSON`,
      DEPAN: `${PATH_DPA}\\${JADWAL}\\JSON\\1. Halaman Depan`,
      PERSETUJUAN: `${PATH_DPA}\\${JADWAL}\\JSON\\2. Halaman Persetujuan`,
      SKPD: `${PATH_DPA}\\${JADWAL}\\JSON\\3. DPA SKPD`,
      PENDAPATAN: `${PATH_DPA}\\${JADWAL}\\JSON\\4. DPA Pendapatan`,
      BELANJA: `${PATH_DPA}\\${JADWAL}\\JSON\\5. DPA Belanja`,
      RINCIAN_BELANJA: `${PATH_DPA}\\${JADWAL}\\JSON\\6. DPA Rincian Belanja`,
      PEMBIAYAAN: `${PATH_DPA}\\${JADWAL}\\JSON\\7. Pembiayaan`,
    }
  },
  TOKEN,
  TAHUN,
  JADWAL,
  SUFFIX,
}

export default config

