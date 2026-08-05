<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div>
            <span class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none block">E-VOTING OSIS</span>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <router-link
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm shadow-blue-500/10 flex items-center space-x-1.5"
          >
            <span>Ke Dashboard</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
          <router-link
            v-else
            to="/login"
            class="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 shadow-sm flex items-center space-x-1.5"
          >
            <LogIn class="w-4 h-4" />
            <span>Masuk Sistem</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="w-full min-h-[90vh] overflow-hidden flex flex-col items-center justify-center relative bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200/50 py-16 sm:py-24">
      
      <!-- Parallax Floating Background -->
      <ParallaxFloating :sensitivity="-0.6" class="absolute inset-0 z-0 pointer-events-none">
        <FloatingElement
          :depth="0.5"
          class="top-[12%] left-[4%] md:top-[18%] md:left-[6%] pointer-events-auto"
        >
          <img
            :src="exampleImages[0].url"
            :alt="exampleImages[0].title"
            class="w-20 h-16 sm:w-28 sm:h-20 md:w-36 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-[6deg] shadow-2xl rounded-2xl border-2 border-white"
          />
        </FloatingElement>

        <FloatingElement
          :depth="1"
          class="top-[2%] left-[78%] md:top-[6%] md:left-[80%] pointer-events-auto"
        >
          <img
            :src="exampleImages[1].url"
            :alt="exampleImages[1].title"
            class="w-36 h-28 sm:w-44 sm:h-36 md:w-52 md:h-40 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rotate-12 shadow-2xl rounded-2xl border-2 border-white"
          />
        </FloatingElement>

        <FloatingElement
          :depth="2.5"
          class="top-[82%] left-[5%] md:top-[74%] md:left-[8%] pointer-events-auto"
        >
          <img
            :src="exampleImages[2].url"
            :alt="exampleImages[2].title"
            class="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-2xl border-2 border-white"
          />
        </FloatingElement>

        <FloatingElement
          :depth="1.8"
          class="top-[3%] left-[10%] md:top-[2%] md:left-[12%] pointer-events-auto"
        >
          <img
            :src="exampleImages[3].url"
            :alt="exampleImages[3].title"
            class="w-32 h-28 sm:w-40 sm:h-36 md:w-48 md:h-44 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl -rotate-[8deg] rounded-2xl border-2 border-white"
          />
        </FloatingElement>

        <FloatingElement
          :depth="1.2"
          class="top-[76%] left-[80%] md:top-[68%] md:left-[82%] pointer-events-auto"
        >
          <img
            :src="exampleImages[4].url"
            :alt="exampleImages[4].title"
            class="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[15deg] rounded-2xl border-2 border-white"
          />
        </FloatingElement>
      </ParallaxFloating>

      <!-- Center Content -->
      <div class="flex flex-col justify-center items-center w-full max-w-[280px] sm:max-w-[450px] md:max-w-[700px] lg:max-w-[900px] z-10 text-center pointer-events-auto px-4 space-y-6 sm:space-y-8">

        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-tight w-full flex flex-col items-center justify-center">
          <span>Pemilihan OSIS Lebih</span>
            <TextRotate
              :texts="[
                'Aman',
                'Transparan',
                'Cepat',
                'Digital',
                'Jujur',
                'Modern',
                'Praktis'
              ]"
              mainClassName="overflow-hidden px-4 py-1 bg-blue-50 border border-blue-200/50 rounded-2xl shadow-inner text-blue-600"
              :rotationInterval="2500"
              staggerFrom="last"
              splitBy="characters"
              :staggerDuration="0.025"
            />
        </h1>

        <p class="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Platform E-Voting resmi untuk menyalurkan hak suara Anda secara aman, rahasia, cepat, dan 100% transparan demi kemajuan kepemimpinan sekolah.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4">
          <router-link
            v-slot="{ navigate }"
            to="/vote"
            custom
          >
            <button
              @click="navigate"
              class="w-full sm:w-auto text-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {{ authStore.isAuthenticated ? 'Gunakan Hak Pilih' : 'Mulai Memilih' }}
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xs font-medium">
            &copy; 2026 E-Voting OSIS. Seluruh Hak Cipta Dilindungi.
        </p>
    </div>
</footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import TextRotate from '@/components/ui/TextRotate.vue';
import ParallaxFloating from '@/components/ui/ParallaxFloating.vue';
import FloatingElement from '@/components/ui/FloatingElement.vue';
import {
  School,
  LogIn,
  ArrowRight,
  Vote,
  Users,
  ShieldCheck,
  BarChart3,
  Sparkles
} from 'lucide-vue-next';

const authStore = useAuthStore();

const currentStats = ref({
  total_siswa: '1.200+',
  total_pemilih: '840+',
  total_kandidat: '3 Paslon',
});

const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    title: "Siswa Belajar",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    title: "Kolaborasi Siswa",
  },
  {
    url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop",
    title: "Pemilihan Suara",
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    title: "Diskusi Sekolah",
  },
  {
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    title: "Kebersamaan Siswa",
  }
];

// Mock candidate profiles for public display on the landing page
const mockCandidates = ref([
  {
    id: 1,
    nomor_urut: 1,
    nama_paslon: 'Rian Hidayat & Amelia Putri',
    slogan: 'Bersama Mewujudkan OSIS Digital dan Kreatif',
    visi: 'Mewujudkan OSIS sebagai wadah pengembangan bakat dan minat siswa yang inovatif, komunikatif, dan berbasis teknologi untuk masa depan gemilang.',
    misi_list: [
      'Menyusun program pengembangan soft-skill siswa berbasis teknologi digital.',
      'Meningkatkan kolaborasi antar ekstrakurikuler melalui festival sekolah tahunan.',
      'Menyediakan media aspirasi online agar komunikasi siswa dengan OSIS berjalan lancar.'
    ],
    foto_url: null
  },
  {
    id: 2,
    nomor_urut: 2,
    nama_paslon: 'Fahri Alamsyah & Sarah Nabila',
    slogan: 'Solidaritas, Kejujuran, dan Prestasi Bersama',
    visi: 'Membangun karakter siswa yang religius, berintegritas, mandiri, dan berdaya saing global melalui kebersamaan antar pengurus OSIS.',
    misi_list: [
      'Menyelenggarakan program bakti sosial dan pengabdian masyarakat secara berkala.',
      'Mengaktifkan kembali forum literasi sains dan seni siswa di sekolah.',
      'Meningkatkan pembinaan kedisiplinan dan budi pekerti luhur di sekolah.'
    ],
    foto_url: null
  },
  {
    id: 3,
    nomor_urut: 3,
    nama_paslon: 'Desta Pratama & Keisha Aurelia',
    slogan: 'Aktif, Adaptif, dan Peduli Lingkungan Sekolah',
    visi: 'Mewujudkan lingkungan sekolah yang hijau, asri, sehat, dan menyenangkan untuk kenyamanan belajar, dengan mengedepankan kepedulian sosial.',
    misi_list: [
      'Mengkampanyekan gerakan sekolah bebas plastik dan pemilahan sampah organik.',
      'Mendirikan komunitas belajar mandiri siswa untuk tutor sebaya.',
      'Menyelenggarakan ajang olahraga persahabatan antar kelas secara rutin.'
    ],
    foto_url: null
  }
]);

const loadRealStats = async () => {
  if (authStore.isAuthenticated) {
    try {
      const statsRes = await api.get('/statistics');
      const summary = statsRes.data.summary;
      currentStats.value = {
        total_siswa: summary.total_siswa.toLocaleString('id-ID'),
        total_pemilih: summary.total_pemilih.toLocaleString('id-ID'),
        total_kandidat: `${summary.total_kandidat} Paslon`,
      };
    } catch (err) {
      console.error('Failed to load real stats:', err);
    }
  }
};

const loadRealCandidates = async () => {
  if (authStore.isAuthenticated) {
    try {
      const candRes = await api.get('/candidate');
      if (candRes.data && candRes.data.length > 0) {
        mockCandidates.value = candRes.data.map(c => ({
          id: c.kandidat_id,
          nomor_urut: c.nomor_urut,
          nama_paslon: c.nama_paslon,
          slogan: c.slogan || 'Bersama Mewujudkan OSIS Lebih Baik',
          visi: c.visi || 'Mewujudkan OSIS yang aktif, solutif, dan kolaboratif.',
          misi_list: c.misi ? c.misi.split('\n').filter(l => l.trim() !== '') : ['Mengembangkan kreativitas.', 'Meningkatkan kerjasama.'],
          foto_url: c.foto ? `/api/uploads/${c.foto}` : null,
        }));
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
    }
  }
};

onMounted(async () => {
  await loadRealStats();
  await loadRealCandidates();
});
</script>

<style scoped>
/* Scroll behavior smooth for anchors */
html {
  scroll-behavior: smooth;
}
</style>
