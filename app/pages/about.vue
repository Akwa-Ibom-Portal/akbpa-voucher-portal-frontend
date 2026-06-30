<template>
  <div>
    <PageHero
      eyebrow="About AKSBPA"
      title="Building a More Food-Secure Akwa Ibom"
      subtitle="The Akwa Ibom State Bulk Purchase Agency (AKSBPA) is a public institution established by the Government of Akwa Ibom State to promote food security, strengthen agricultural value chains, stabilize food prices, and improve access to affordable staple food commodities for residents of the State."
    />

    <!-- Who we are -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-5 text-gray-600 dark:text-white/80 leading-relaxed">
      <p>
        The Agency serves as the central coordinating institution for strategic food
        procurement, storage, distribution, and market intervention programmes. Through
        efficient planning, transparent procurement processes, and strong partnerships
        with farmers, cooperatives, suppliers, processors, development partners, and
        community stakeholders, AKSBPA works to ensure a resilient and sustainable food system.
      </p>
      <p>
        Our work extends beyond the purchase and distribution of food commodities. We
        facilitate farmer participation in government programmes, support local
        agricultural production, monitor food markets, manage strategic food reserves,
        and provide data-driven recommendations that inform food security policies and interventions.
      </p>
      <p>
        By integrating innovation, accountability, and collaboration into every aspect of
        our operations, the Agency contributes to improved livelihoods, economic growth,
        and the overall well-being of the people of Akwa Ibom State.
      </p>
    </section>

    <!-- History / Establishment / Legal framework -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div v-reveal>
          <UBadge color="primary" variant="subtle" class="mb-3">Our History</UBadge>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">How We Came to Be</h2>
          <div class="space-y-4 text-gray-600 dark:text-white/80 leading-relaxed text-sm">
            <p>
              Food security is fundamental to sustainable development, economic
              stability, and social well-being. Recognizing the importance of ensuring a
              reliable food supply and protecting citizens from the effects of market
              volatility, the Government of Akwa Ibom State established the Bulk Purchase
              Agency as part of broader efforts to strengthen food systems and support
              inclusive economic development.
            </p>
            <p>
              The Agency was created to coordinate government-led food procurement and
              distribution initiatives, improve supply chain efficiency, reduce
              post-harvest losses, encourage local agricultural production, and enhance
              transparency in the management of food intervention programmes.
            </p>
            <p>
              Since its establishment, AKSBPA has continued to expand its partnerships
              with farmers, cooperatives, suppliers, development organizations, and
              public institutions to build a food distribution system that is efficient,
              accountable, and responsive to the needs of communities across all
              thirty-one Local Government Areas of the State.
            </p>
          </div>
        </div>

        <div v-reveal="100">
          <UBadge color="primary" variant="subtle" class="mb-3">Establishment</UBadge>
          <p class="text-sm text-gray-600 dark:text-white/80 leading-relaxed">
            The Akwa Ibom State Bulk Purchase Agency was established by law as a
            statutory agency of the Government of Akwa Ibom State. The Agency is
            responsible for coordinating strategic food procurement and related
            programmes in accordance with its enabling legislation and other applicable
            laws, regulations, financial management standards, and public procurement
            requirements. AKSBPA operates with a commitment to transparency,
            accountability, professionalism, and responsible stewardship of public resources.
          </p>
        </div>

        <div v-reveal="200">
          <UBadge color="primary" variant="subtle" class="mb-3">Legal Framework</UBadge>
          <p class="text-sm text-gray-600 dark:text-white/80 leading-relaxed mb-4">The operations of the Agency are guided by:</p>
          <ul class="space-y-2">
            <li v-for="l in legalFramework" :key="l" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
              <UIcon name="i-lucide-scale" class="size-4 text-akbpaGreen-600 mt-0.5 shrink-0" />
              {{ l }}
            </li>
          </ul>
          <p class="text-sm text-gray-500 mt-4">
            These legal instruments ensure that the Agency's activities are conducted
            with integrity, fairness, transparency, and compliance with established standards.
          </p>
        </div>
      </div>
    </section>

    <!-- Mandate -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <UBadge color="secondary" variant="subtle" class="mb-3">Our Mandate</UBadge>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-5">The mandate of AKSBPA is to:</h2>
      <ul class="grid sm:grid-cols-2 gap-3">
        <li v-for="m in mandate" :key="m" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
          <UIcon name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600 mt-0.5 shrink-0" />
          {{ m }}
        </li>
      </ul>
    </section>

    <!-- Vision & Mission -->
    <section class="relative overflow-hidden bg-gradient-to-br from-akbpaGreen-800 via-akbpaGreen-900 to-akbpaGreen-800 text-white py-16">
      <div aria-hidden="true" class="bg-blob absolute -z-10 top-0 right-0 size-72 rounded-full bg-akbpaOrange-400/15" />
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-6">
        <div v-reveal class="bg-white/10 rounded-2xl p-6 hover-lift">
          <UIcon name="i-lucide-telescope" class="size-7 text-akbpaOrange-300 mb-3" />
          <h3 class="font-bold text-lg mb-2">Our Vision</h3>
          <p class="text-sm text-white/80 leading-relaxed">
            To be a leading public institution that ensures sustainable food security,
            promotes transparent procurement, supports agricultural development, and
            improves access to affordable food for every resident of Akwa Ibom State.
          </p>
        </div>
        <div v-reveal="100" class="bg-white/10 rounded-2xl p-6 hover-lift">
          <UIcon name="i-lucide-target" class="size-7 text-akbpaOrange-300 mb-3" />
          <h3 class="font-bold text-lg mb-2">Our Mission</h3>
          <p class="text-sm text-white/80 leading-relaxed">
            To strengthen food security through strategic bulk procurement, efficient
            food distribution, responsible management of strategic food reserves, farmer
            empowerment, market stabilization, and transparent public service that
            improves the quality of life of the people of Akwa Ibom State.
          </p>
        </div>
      </div>
    </section>

    <!-- Core values -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="text-center mb-10">
        <UBadge color="primary" variant="subtle" class="mb-3">Our Core Values</UBadge>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">What Guides Our Work</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <UCard
          v-for="(v, i) in coreValues" :key="v.title" v-reveal="(i % 4) * 80"
          class="hover-lift border-transparent hover:border-akbpaGreen-300 dark:hover:border-akbpaGreen-700"
        >
          <div class="h-11 w-11 rounded-xl bg-akbpaGreen-50 dark:bg-akbpaGreen-950 flex items-center justify-center mb-3">
            <UIcon :name="v.icon" class="size-5 text-akbpaGreen-600" />
          </div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ v.title }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ v.desc }}</p>
        </UCard>
      </div>
    </section>

    <!-- Strategic objectives -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div v-reveal class="text-center mb-10">
          <UBadge color="secondary" variant="subtle" class="mb-3">Strategic Objectives</UBadge>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Where We're Headed</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <UCard v-for="(o, i) in objectives" :key="o.title" v-reveal="(i % 4) * 80" class="hover-lift">
            <p class="font-semibold text-gray-900 dark:text-white">{{ o.title }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ o.desc }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- What we do -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <UBadge color="primary" variant="subtle" class="mb-3">What We Do</UBadge>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-5">
        AKSBPA carries out a broad range of responsibilities that contribute to food security and agricultural development, including:
      </h2>
      <ul class="grid sm:grid-cols-2 gap-3">
        <li v-for="w in whatWeDo" :key="w" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
          <UIcon name="i-lucide-dot" class="size-5 text-akbpaOrange-500 mt-0.5 shrink-0" />
          {{ w }}
        </li>
      </ul>
    </section>

    <!-- Organizational structure -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <UBadge color="secondary" variant="subtle" class="mb-3">Organizational Structure</UBadge>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">How We're Organized</h2>
        <p class="text-sm text-gray-500 mb-8">To deliver its mandate effectively, the Agency operates through a structured governance and administrative framework.</p>
        <div class="grid sm:grid-cols-3 gap-5">
          <UCard v-for="s in orgStructure" :key="s.title" class="hover-lift">
            <UIcon name="i-lucide-network" class="size-6 text-akbpaGreen-600 mb-3" />
            <p class="font-semibold text-gray-900 dark:text-white">{{ s.title }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ s.desc }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Leadership -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <UBadge color="primary" variant="subtle" class="mb-3">Leadership</UBadge>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Leadership</h2>
      <p class="text-sm text-gray-600 dark:text-white/80 leading-relaxed">
        The Agency is led by experienced professionals dedicated to advancing food
        security, promoting transparency, and delivering effective public service. The
        leadership team provides strategic direction, oversees programme implementation,
        ensures compliance with statutory requirements, and fosters collaboration with
        key stakeholders to achieve the Agency's objectives.
      </p>
      <UAlert
        color="info" variant="subtle" icon="i-lucide-image" class="mt-5"
        title="Leadership profiles coming soon"
        description="Leadership profiles, photographs, and official biographies will be published on this page as appointments are confirmed."
      />
    </section>

    <!-- Departments -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div v-reveal class="text-center mb-10">
          <UBadge color="secondary" variant="subtle" class="mb-3">Departments</UBadge>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">The Agency's operations are supported by specialized departments</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <UCard v-for="(d, i) in departments" :key="d.title" v-reveal="(i % 3) * 80" class="hover-lift">
            <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ d.title }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ d.desc }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Commitment -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-4 text-gray-600 dark:text-white/80 leading-relaxed">
      <UBadge color="primary" variant="subtle" class="mb-3">Our Commitment</UBadge>
      <p>
        At AKSBPA, we remain committed to building a resilient food system that serves
        every resident of Akwa Ibom State with fairness, efficiency, and integrity.
      </p>
      <p>
        Through transparent procurement, responsible resource management, innovation,
        and collaboration with stakeholders, we strive to ensure that food security
        becomes a lasting foundation for economic growth, social stability, and improved
        quality of life.
      </p>
      <p>
        Every programme we implement, every partnership we establish, and every service
        we provide is guided by our commitment to excellence in public service and the
        sustainable development of Akwa Ibom State.
      </p>
    </section>

    <!-- CTA -->
    <section class="relative overflow-hidden bg-gradient-to-br from-akbpaGreen-700 to-akbpaGreen-900 text-white py-16">
      <div aria-hidden="true" class="bg-blob absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] rounded-full bg-akbpaOrange-400/10" />
      <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-2xl font-bold">Partner <span class="gradient-text-light">With Us</span></h2>
        <p class="mt-3 text-white/80">
          Whether you are a farmer, cooperative, supplier, development partner,
          community organization, or interested citizen, we invite you to join us in
          advancing food security and agricultural development across Akwa Ibom State.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <UButton to="/programmes" size="lg" color="neutral" class="pill-btn px-6 bg-white text-akbpaGreen-800 hover:bg-white/90">Explore Our Services</UButton>
          <UButton to="/register/farmer" size="lg" color="secondary" class="pill-btn px-6">Register as a Farmer</UButton>
          <UButton to="/register/supplier" size="lg" variant="outline" class="pill-btn px-6 text-white ring-white/40 hover:bg-white/10">Become an Accredited Supplier</UButton>
          <UButton to="/contact" size="lg" variant="outline" class="pill-btn px-6 text-white ring-white/40 hover:bg-white/10">Contact the Agency</UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'About the Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Learn about the Akwa Ibom State Bulk Purchase Agency (AKSBPA), our mandate, vision, mission, core values, strategic objectives, leadership, and commitment to food security, transparent procurement, and sustainable agricultural development.',
  keywords: 'About AKSBPA, Akwa Ibom State Bulk Purchase Agency, Food Security, Bulk Procurement, Transparent Procurement, Farmer Support, Agricultural Development, Market Stabilization, Strategic Food Reserves',
  ogTitle: 'About the Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const legalFramework = [
  'The Akwa Ibom State Bulk Purchase Agency Establishment Law.',
  'Applicable Public Procurement Laws and Regulations.',
  'Financial Regulations of Akwa Ibom State.',
  'Public Service Rules.',
  'Relevant Agricultural and Food Security Policies.',
  'Government directives relating to food security, emergency response, and strategic food reserve management.',
  'Other applicable laws and regulations governing public administration and financial accountability.',
]

const mandate = [
  'Promote food security across Akwa Ibom State.',
  'Procure food commodities through transparent and competitive processes.',
  'Maintain strategic food reserves to support emergency response and market stability.',
  'Coordinate government food intervention programmes.',
  'Improve access to affordable food for vulnerable populations and the general public.',
  'Strengthen partnerships with local farmers, cooperatives, processors, and suppliers.',
  'Support agricultural production through structured market opportunities.',
  'Monitor food prices and supply trends across the State.',
  'Provide reliable information that supports evidence-based policy decisions.',
  'Encourage sustainable agricultural and food distribution systems.',
]

const coreValues = [
  { title: 'Integrity', desc: 'We uphold honesty, fairness, and ethical conduct in all our operations and decision-making processes.', icon: 'i-lucide-shield-check' },
  { title: 'Transparency', desc: 'We promote openness and accountability in procurement, distribution, financial management, and stakeholder engagement.', icon: 'i-lucide-eye' },
  { title: 'Service Excellence', desc: 'We are committed to delivering efficient, responsive, and high-quality public services.', icon: 'i-lucide-award' },
  { title: 'Accountability', desc: 'We take responsibility for our actions and ensure prudent management of public resources.', icon: 'i-lucide-clipboard-check' },
  { title: 'Collaboration', desc: 'We build strong partnerships with farmers, cooperatives, suppliers, communities, development partners, and government institutions.', icon: 'i-lucide-heart-handshake' },
  { title: 'Innovation', desc: 'We embrace technology, data, and continuous improvement to enhance operational efficiency and service delivery.', icon: 'i-lucide-lightbulb' },
  { title: 'Professionalism', desc: 'We maintain high standards of competence, respect, and dedication in the discharge of our responsibilities.', icon: 'i-lucide-briefcase' },
  { title: 'Sustainability', desc: 'We support policies and programmes that strengthen long-term food security, agricultural productivity, and environmental responsibility.', icon: 'i-lucide-leaf' },
]

const objectives = [
  { title: 'Food Security', desc: 'Strengthen food availability and accessibility through coordinated procurement and distribution programmes.' },
  { title: 'Agricultural Development', desc: 'Support local farmers by creating sustainable market opportunities and encouraging increased agricultural productivity.' },
  { title: 'Market Stabilization', desc: 'Reduce excessive food price fluctuations through strategic market interventions and improved supply chain coordination.' },
  { title: 'Strategic Food Reserves', desc: 'Develop and maintain adequate food reserves to improve preparedness for emergencies and supply disruptions.' },
  { title: 'Transparent Procurement', desc: 'Ensure all procurement activities are conducted fairly, competitively, and in compliance with applicable laws and regulations.' },
  { title: 'Digital Transformation', desc: 'Leverage technology to improve registration, procurement, monitoring, reporting, and citizen engagement.' },
  { title: 'Stakeholder Engagement', desc: 'Strengthen collaboration with communities, farmers, suppliers, civil society organizations, development partners, and relevant government agencies.' },
  { title: 'Institutional Excellence', desc: 'Build a high-performing institution that delivers effective services through skilled personnel, sound governance, and continuous improvement.' },
]

const whatWeDo = [
  'Strategic bulk procurement of food commodities.',
  'Management of strategic food reserves.',
  'Administration of food support and intervention programmes.',
  'Farmer registration and engagement.',
  'Supplier accreditation and management.',
  'Market price monitoring and reporting.',
  'Coordination of food distribution networks.',
  'Procurement planning and contract administration.',
  'Monitoring and evaluation of programme implementation.',
  'Research and policy support.',
  'Public awareness and stakeholder engagement.',
  'Digital service delivery and information management.',
]

const orgStructure = [
  { title: 'Governing Board', desc: 'Provides strategic oversight, policy direction, and institutional governance.' },
  { title: 'Executive Management', desc: 'Responsible for implementing government policies, coordinating programmes, and managing the day-to-day operations of the Agency.' },
  { title: 'Management Team', desc: 'Supports operational planning, programme implementation, financial management, procurement oversight, monitoring, and stakeholder engagement.' },
]

const departments = [
  { title: 'Office of the Executive Secretary / Chief Executive', desc: 'Provides strategic leadership and overall coordination of the Agency.' },
  { title: 'Procurement and Supply Chain Management', desc: 'Coordinates food procurement, supplier engagement, contract management, logistics, and inventory planning.' },
  { title: 'Food Distribution and Operations', desc: 'Manages warehousing, distribution networks, redemption centres, and programme implementation.' },
  { title: 'Strategic Food Reserve Management', desc: 'Oversees the acquisition, storage, preservation, monitoring, and replenishment of strategic food reserves.' },
  { title: 'Finance and Accounts', desc: 'Ensures prudent financial management, budgeting, accounting, reporting, and internal controls.' },
  { title: 'Planning, Research and Statistics', desc: 'Conducts research, policy analysis, programme evaluation, market intelligence, and data management.' },
  { title: 'Information and Communication Technology (ICT)', desc: 'Develops and manages digital platforms, information systems, cybersecurity, and technology infrastructure.' },
  { title: 'Legal Services', desc: 'Provides legal advice, contract review, regulatory compliance, and institutional legal support.' },
  { title: 'Human Resources and Administration', desc: 'Manages recruitment, staff development, performance management, and administrative services.' },
  { title: 'Public Affairs and Communications', desc: 'Coordinates public information, media relations, stakeholder engagement, publications, and public awareness campaigns.' },
  { title: 'Internal Audit', desc: 'Strengthens accountability through risk assessment, compliance monitoring, and independent internal reviews.' },
  { title: 'Monitoring and Evaluation', desc: 'Tracks programme performance, measures impact, and supports evidence-based decision-making.' },
]
</script>
