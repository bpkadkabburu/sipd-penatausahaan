require('dotenv').config()

const BASE_URL = 'https://sipd.kemendagri.go.id/penatausahaan'
const BASE_API = 'https://service.sipd.kemendagri.go.id'
const PATH_DPA = process.env.PATH_DPA
const JADWAL = process.env.JADWAL
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const TAHUN = process.env.TAHUN
const SUFFIX = `- ${TAHUN} - DPA ${process.env.SUFFIX_DPA}`

module.exports = {
    URL: {
        BASE: {
            HOME: BASE_URL,
            LOGIN: `${BASE_URL}/login`
        },
        API: {
            PRELOGIN: `${BASE_API}/auth/auth/pre-login`, // harusnya ini dipakai untuk puppeteer tapi karena sudah ada captcha jadinya males, direct download json aja nanti pdf generate sendiri
            LOGIN: `${BASE_API}/auth/auth/login`, // harusnya ini dipakai untuk puppeteer tapi karena sudah ada captcha jadinya males, direct download json aja nanti pdf generate sendiri
            JADWAL: `${BASE_API}/referensi/strict/laporan/dpa/dpa/jadwal-pergeseran`,
            LIST_SKPD: `${BASE_API}/referensi/strict/skpd/list/`,
            PROFILE: `${BASE_API}/auth/strict/user/profile`,
            PENDAPATAN: `${BASE_API}/referensi/strict/dpa/penerimaan/pendapatan`, // paginate
            BELANJA: `${BASE_API}/referensi/strict/dpa/penarikan/belanja`, // paginate
            PENERIMAAN_PEMBIAYAAN: `${BASE_API}/referensi/strict/dpa/penerimaan/pembiayaan`, // paginate
            PENGELUARAN_PEMBIAYAAN: `${BASE_API}/referensi/strict/dpa/penarikan/pembiayaan`, // paginate
            VALIDASI: {
                RAK: {
                    BELANJA: {
                        INDEX: `${BASE_API}/referensi/strict/validasi/rak/belanja`, // paginate
                        DETAIL: `${BASE_API}/referensi/strict/validasi/rak/belanja/index-detail`,
                    }
                }
            }
        },
        DPA: {
            PERSETUJUAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/halaman-persetujuan-dpa`,
            DEPAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/halaman-depan-dpa`,
            SKPD: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/skpd`,
            PENDAPATAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/pendapatan`,
            BELANJA: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/belanja`,
            RINCIAN_BELANJA: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/rincian-belanja`,
            PEMBIAYAAN: `${BASE_URL}/pengeluaran/dpa/laporan/dpa/pembiayaan`
        },
        RAK: {
            PEMDA: `${BASE_URL}/pengeluaran/dpa/laporan/rak/pemda`,
            SKPD: `${BASE_URL}/pengeluaran/dpa/laporan/rak/skpd`,
            PENDAPATAN: `${BASE_URL}/pengeluaran/dpa/laporan/rak/pendapatan`,
            BELANJA: `${BASE_URL}/pengeluaran/dpa/laporan/rak/belanja`,
            PENERIMAAN_PEMBIAYAAN: `${BASE_URL}/pengeluaran/dpa/laporan/rak/penerimaan-pembiayaan`,
            PENGELUARAN_PEMBIAYAAN: `${BASE_URL}/pengeluaran/dpa/laporan/rak/pengeluaran-pembiayaan`,
        }
    },
    PATH: {
        DPA: {
            UTAMA: `${PATH_DPA}\\${JADWAL}`,
            JSON: `${PATH_DPA}\\${JADWAL}\\JSON`,
            PERSETUJUAN: `${PATH_DPA}\\${JADWAL}\\1. Halaman Persetujuan`,
            DEPAN: `${PATH_DPA}\\${JADWAL}\\2. Halaman Depan`,
            SKPD: `${PATH_DPA}\\${JADWAL}\\3. DPA SKPD`,
            PENDAPATAN: `${PATH_DPA}\\${JADWAL}\\4. DPA Pendapatan`,
            BELANJA: `${PATH_DPA}\\${JADWAL}\\5. DPA Belanja`,
            RINCIAN_BELANJA: `${PATH_DPA}\\${JADWAL}\\6. DPA Rincian Belanja`,
            PEMBIAYAAN: `${PATH_DPA}\\${JADWAL}\\7. Pembiayaan`,

        }
    },
    USER,
    PASSWORD,
    TAHUN,
    JADWAL,

}