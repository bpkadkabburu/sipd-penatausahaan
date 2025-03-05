import dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://sipd.kemendagri.go.id/penatausahaan"
const BASE_API = "https://service.sipd.kemendagri.go.id"
const PATH_DPA = process.env.PATH_DPA
const JADWAL = process.env.JADWAL
const TOKEN = process.env.TOKEN
const TAHUN = process.env.TAHUN
const SUFFIX = `- ${TAHUN} - DPA ${process.env.SUFFIX_DPA}`

interface URL {
  BASE: {
    HOME: string
    LOGIN: string
  }
  API: {
    JADWAL: string
    LIST_SKPD: string
    PROFILE: string
    PENDAPATAN: string
    BELANJA: string
    PENERIMAAN_PEMBIAYAAN: string
    PENGELUARAN_PEMBIAYAAN: string
    VALIDASI: {
      RAK: {
        BELANJA: {
          INDEX: string
          DETAIL: string
        }
      }
    }
  }
  DPA: {
    PERSETUJUAN: string
    DEPAN: string
    SKPD: string
    PENDAPATAN: string
    BELANJA: string
    RINCIAN_BELANJA: string
    PEMBIAYAAN: string
  }
  RAK: {
    PEMDA: string
    SKPD: string
    PENDAPATAN: string
    BELANJA: string
    PENERIMAAN_PEMBIAYAAN: string
    PENGELUARAN_PEMBIAYAAN: string
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
      LIST_SKPD: `${BASE_API}/referensi/strict/skpd/list/`,
      PROFILE: `${BASE_API}/auth/strict/user/profile`,
      PENDAPATAN: `${BASE_API}/referensi/strict/dpa/penerimaan/pendapatan`,
      BELANJA: `${BASE_API}/referensi/strict/dpa/penarikan/belanja`,
      PENERIMAAN_PEMBIAYAAN: `${BASE_API}/referensi/strict/dpa/penerimaan/pembiayaan`,
      PENGELUARAN_PEMBIAYAAN: `${BASE_API}/referensi/strict/dpa/penarikan/pembiayaan`,
      VALIDASI: {
        RAK: {
          BELANJA: {
            INDEX: `${BASE_API}/referensi/strict/validasi/rak/belanja`,
            DETAIL: `${BASE_API}/referensi/strict/validasi/rak/belanja/index-detail`,
          },
        },
      },
    },
    DPA: {
      PERSETUJUAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/halaman-persetujuan-dpa`,
      DEPAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/halaman-depan-dpa`,
      SKPD: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/skpd`,
      PENDAPATAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/pendapatan`,
      BELANJA: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/belanja`,
      RINCIAN_BELANJA: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/rincian-belanja`,
      PEMBIAYAAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/pembiayaan`,
    },
    RAK: {
      PEMDA: `${BASE_URL}/pengeluaran/dpa/laporan/rak/pemda`,
      SKPD: `${BASE_URL}/pengeluaran/dpa/laporan/rak/skpd`,
      PENDAPATAN: `${BASE_URL}/pengeluaran/dpa/laporan/rak/pendapatan`,
      BELANJA: `${BASE_URL}/pengeluaran/dpa/laporan/rak/belanja`,
      PENERIMAAN_PEMBIAYAAN: `${BASE_URL}/pengeluaran/dpa/laporan/rak/penerimaan-pembiayaan`,
      PENGELUARAN_PEMBIAYAAN: `${BASE_URL}/pengeluaran/dpa/laporan/rak/pengeluaran-pembiayaan`,
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
    JSON:{
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

