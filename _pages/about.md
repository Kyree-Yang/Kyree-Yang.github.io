---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hi, nice to meet you here! I'm Ruikai Yang. I am currently enrolled in a dual-degree program, pursuing a Bachelor’s in Computer Science at the University of Michigan and a Bachelor’s in Mechanical Engineering at Shanghai Jiao Tong University. My research interest lies in Robotics, especially motion planning. I'm working as a research assistant in [ROAHM Lab](https://www.roahmlab.com/), where I am advised by Professor [Ram Vasudevan](https://www.roahmlab.com/ram-personal). Now I'm working on AGHF (Affine Geometric Heat Flow), which is a path optimization method that evolves trajectories toward optimal solutions by applying affine-invariant geometric heat flow equations. My interest in robotics starts when I was building an [Automatic Complex-terrain Vehicle with
Transformable Wheels](https://drive.google.com/file/d/11Ko0Iz_yxDsFiDTv31OPZtjMY-9dqoA3/view?usp=sharing) on the Design and Manufacturing classes at SJTU. I am actively seeking internship opportunities for Winter 2025 and Summer 2026. Click here to view my [CV](https://drive.google.com/file/d/1cnGPar6RyXA4PTvZIXIwamS3_Z7gBYUu/view?usp=sharing).

<!-- # 🔥 News
- *2022.02*: &nbsp;🎉🎉 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2022.02*: &nbsp;🎉🎉 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  -->

# 📝 Publications 
- *2025*: [Phasing Through the Flames: Rapid Motion Planning with the AGHF PDE for Arbitrary Objective Functions and Constraints](https://drive.google.com/file/d/1O7Q9re7RWqmCqSX7_24W9CXT7vo9t69f/view?usp=sharing)
- *2024*: [A Pathological Diagnosis Method Combining Image-Text Large Model and Rule-Based Reasoning](https://drive.google.com/file/d/1tEEharN7Kb1n-DYoO8aeS-_3CeG5n06H/view?usp=sharing)


# 🚀 Projects

## 🤖 AGHF-based Optimal Path Planning for Robotics  
<small><em> Trajectory Optimization · Chebyshev interpolation · Dynamcis &nbsp;|&nbsp; Fall 2024 – Present</em></small>

As a research assistant in the [ROAHM Lab](https://www.roahmlab.com/), I implemented and validated the Affine Geometric Heat Flow (AGHF) algorithm for robotic arm motion planning. This work spans both theoretical development and practical deployment, from simulation to real-world hardware. Click to view our [paper](https://drive.google.com/file/d/1O7Q9re7RWqmCqSX7_24W9CXT7vo9t69f/view?usp=sharing) and the full [2-min demo video](https://drive.google.com/file/d/15BX5_gLY5BFMNQd0kJqNu0fHDIMAdMLI/view?usp=sharing).

- Developed a full-stack AGHF-based trajectory optimizer for robotic arms, enabling efficient motion planning under complex objectives and constraints.
- Verified and extended the method with time-scaling features and endpoint constraints for real-world feasibility.
- Successfully transferred simulation results to hardware, achieving reliable trajectory tracking and obstacle avoidance.
- Co-authored a peer-reviewed paper demonstrating the effectiveness and generality of the approach.

**Demo:**  
<div style="display: flex; gap: 22px; align-items: flex-start; justify-content: flex-start; margin: 18px 0 24px 0; margin-left: 30px; flex-wrap: wrap;">

  <div style="flex:1 1 420px; min-width:240px; max-width:420px; text-align:center;">
    <img src="images/aghf_sim.gif" alt="AGHF Simulation Demo" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 2px 12px rgba(61,90,254,0.12);" />
    <div style="font-size:15px;color:#555; margin-top:8px;">
      <em>Optimal trajectory planning in simulation</em>
    </div>
  </div>

  <div style="flex:1 1 420px; min-width:240px; max-width:420px; text-align:center;">
    <img src="images/aghf_hardware.gif" alt="AGHF Hardware Demo" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 2px 12px rgba(61,90,254,0.12);" />
    <div style="font-size:15px;color:#555; margin-top:8px;">
      <em>Real-world hardware implementation</em>
    </div>
  </div>

</div>

---

## 🌐 Crawler Crew: Distributed Internet Search Engine  
<small><em>C++ · Multithread Crawler · Memory Map · Socket Programming  &nbsp;|&nbsp; Winter 2025</em></small>

In Winter 2025, I took the course [System Design of a Search Engine](https://web.eecs.umich.edu/~nham/eecs440w21/) at UMich. Under the guidance of Professor [Nicole Hamilton](https://nicolehamilton.com/) and in collaboration with five other members, we built a **fully functional search engine** from scratch. The majority of our code was implemented in C++, and apart from some basic libraries, we did not rely on any additional external packages. The project covers the entire pipeline of web crawling, text indexing, search, and ranking, involving both system-level engineering and algorithm design. In this project, I'm mainly responsible for the design of the ranker.
Click to view our [presentation slides](https://drive.google.com/file/d/1FGbRYxvjK-vAfHU_dv6T-5CvNNeEbCrX/view?usp=sharing) and [final report](https://drive.google.com/file/d/1VOQzt5-8_eUEl-4789d3tC1rsZnxkAUU/view?usp=sharing).

- Gained in-depth understanding of large-scale information retrieval and distributed system architecture.
- Learned system optimization through better ranking algorithm and more efficient data structure.
- Enhanced my ability to solve complex engineering problems and communicate effectively as a team.

**Demo:**   
<div style="display: flex; gap: 24px; align-items: flex-start; justify-content: flex-start; margin: 18px 0 24px 0; margin-left: 2px; flex-wrap: wrap;">

  <div style="flex:1 1 320px; min-width:260px; max-width:500px; text-align:center;">
    <img src="images/super_quality.gif" alt="Search Engine Demo" style="width:100%; max-width:450px; border-radius:12px; box-shadow:0 2px 12px rgba(61,90,254,0.12);" />
    <div style="font-size:15px;color:#555; margin-top:8px;">
      <em>End-to-end search process demonstration (<a href="https://drive.google.com/file/d/14IXclVzGSuWGfr02a0Ca66xePWN0XvMg/view?usp=sharing" target="_blank">full 5-min Demo</a>)</em>
    </div>
  </div>

  <div style="flex:1 1 260px; min-width:240px; max-width:330px; margin-top:-2px;">
    <table style="width:100%; font-size:15px; border-collapse:collapse; border-radius:14px; overflow:hidden; box-shadow:0 2px 12px rgba(61,90,254,0.07); background:#f9fbfc;">
      <thead>
        <tr style="background:#e3eafc;">
          <th style="padding:8px 12px; text-align:left; font-weight:600;">Key Metrics</th>
          <th style="padding:8px 12px; text-align:right; font-weight:600;">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:6px 12px;">Pages Crawled (M)</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">30</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Crawler Threads</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">7,500</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Seed List Size</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">3,000</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Tokens Indexed (B)</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">20+</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Index Size (GB)</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">500</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Chunk Size (GB)</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">1.1</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Query Latency (ms)</td>
          <td style="padding:6px 12px; text-align:right; font-size:18px; font-weight:600; color:#273469;">300–2,000</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

---

## 🖼️ Diffusion-Pyramid: One Shot Generation for Text-to-Image Diffusion Models  
<small><em>Computer Vision · Data Augmentation · Laplacian Pyramid &nbsp;|&nbsp; Fall 2024</em></small>

This is a class project from [EECS 442 Computer Vision](https://www.eecs.umich.edu/courses/eecs442/fa24/) at UMich. With two teammates, we focused on improving the diversity and controllability of text-to-image diffusion models through advanced data augmentation techniques. The idea I proposed to implement text augmentation got very positive feedback from professor [Liyue Shen](https://liyueshen.engin.umich.edu/). Click to view our [presentation slides](https://docs.google.com/presentation/d/1wTnbqkB1XiFjOb6TpxRg1GLOKs_EYBjrTMspM2bmlOg/edit?usp=sharing) and [final report](https://drive.google.com/file/d/1IM8tzWKQS9wk2Rhvjx5gOQ3uaKe3rNpH/view?usp=sharing).
- Applied image augmentation using Stable Diffusion and Laplacian pyramid methods to enrich training samples and enhance generation robustness.
- Proposed and implemented an original text augmentation technique that refines prompts for more detailed and diverse output.
- The pipeline enables efficient “one shot” generation, facilitating diverse image synthesis from a single prompt with minimal resources.

**Pipeline Illustration:**  
<div style="display: flex; justify-content: flex-start; margin: 18px 0 22px 60px;">
  <img src="images/one_shot_pipeline.png" alt="One Shot Generation Pipeline" style="width:100%; max-width:780px; border-radius:12px; box-shadow:0 2px 12px rgba(61,90,254,0.11);" />
</div>
<div style="font-size:15px; color:#555; margin-top:-10px; margin-left:30px;">
  <em>Project pipeline: combining text augmentation, Stable Diffusion, and Laplacian pyramid for diverse generation</em>
</div>

---


# 🎖 Honors and Awards
- *2025.06* Included on Umich Winter 2025 [Dean's Honor List](https://studentawards.engin.umich.edu/deanslist/)
- *2025.01* Included on Umich Fall 2024 [Dean's Honor List](https://studentawards.engin.umich.edu/deanslist/)
- *2024.12* 2024 First-Class China Undergraduate Excellence Scholarship (top 1%)
- *2024.07* The Tang Junyuan Scholarship (top 0.5%)
- *2024.06* The [Fan Xuji](https://en.wikipedia.org/wiki/Fan_Xuji) Scholarship (top 0.5%)
- *2023.12* China Undergraduate Outstanding Scholarship (top 1%)
- *2023.12* 2023 First-Class China Undergraduate Excellence Scholarship (top 1%)
- *2023.11* The John Wu and Jane Sun Excellence Scholarship (top 1%)
- *2023.10* China Undergraduate National Scholarship (top 1.5%)


# 📖 Educations

<div style="display: flex; gap:28px; flex-wrap: wrap; margin: 18px 0 18px 0;">

  <div style="flex:1 1 310px; min-width:250px; max-width:400px; background: #f9fbfc; border-radius: 14px; box-shadow: 0 2px 14px rgba(61,90,254,0.09); padding: 22px 24px 18px 24px; margin-bottom: 8px;">
    <div style="font-size:1.13rem; font-weight:700; color:#263470; margin-bottom:6px;">
      University of Michigan <span style="font-size:13px; color:#888;">(Ann Arbor, MI)</span>
    </div>
    <div style="font-size:15px; color:#555; margin-bottom:5px;">
      <strong>B.S.E. in Computer Science Engineering</strong>
    </div>
    <div style="font-size:14px; color:#888; margin-bottom:6px;">
      Aug 2024 – May 2026 <span style="color:#3d5afe; font-size:13px;">(Current)</span>
    </div>
    <div style="font-size:15px; margin-bottom:3px;">
      <b>GPA:</b> 4.0 / 4.0
    </div>
    <div style="font-size:14px; color:#444;">
      <b>Selected A+ Courses:</b> Foundations of Computer Science, Computer Vision, Robot Learning ...
    </div>
  </div>

  <div style="flex:1 1 310px; min-width:250px; max-width:400px; background: #f9fbfc; border-radius: 14px; box-shadow: 0 2px 14px rgba(61,90,254,0.09); padding: 22px 24px 18px 24px; margin-bottom: 8px;">
    <div style="font-size:1.13rem; font-weight:700; color:#263470; margin-bottom:6px;">
      Shanghai Jiao Tong University <span style="font-size:13px; color:#888;">(Shanghai, China)</span>
    </div>
    <div style="font-size:15px; color:#555; margin-bottom:5px;">
      <strong>B.Eng. in Mechanical Engineering</strong>
    </div>
    <div style="font-size:14px; color:#888; margin-bottom:6px;">
      Sep 2022 – Aug 2026 <span style="color:#3d5afe; font-size:13px;">(Expected)</span>
    </div>
    <div style="font-size:15px; margin-bottom:3px;">
      <b>GPA:</b> 3.9 / 4.0 <span style="color:#4caf50; font-size:13px;">(Top 1%)</span>
    </div>
    <div style="font-size:14px; color:#444;">
      <b>Selected A+ Courses:</b> Data Structures and Algorithms, Advanced Mathematics, Design and Manufacturing ...
    </div>
  </div>

</div>



# 💬 Teaching and Leadership
- *2024.09 - 2026.05*, Advisor at Joint Institute Advising Center. Organized several workshops.
- *2024.09 - 2026.05*, Member of Joint Institute Alumni. Organized a few events.
- *2024.05 - 2024.08*, Teaching Assistant for PHYS1500J SU 2024. Nominated as Outstanding TA.
- *2023.10*, Invited to give a talk about learning experience to the next incoming class.
- *2023.09 - 2024.08*, Department Leader of Joint Institute Student Union.
- *2022.09 - 2023.08*, Group Leader of Joint Institute Miyuan Youth Volunteer Team.

<div class="teach-photos">
  <div class="teach-photo-box">
    <img src="images/TA.jpg" alt="Teaching Assistant" />
    <div class="teach-photo-caption">PHYS1500J TA (2024)</div>
  </div>
  <div class="teach-photo-box">
    <img src="images/talk.jpg" alt="Talk" />
    <div class="teach-photo-caption">Invited Talk (2023)</div>
  </div>
  <div class="teach-photo-box">
    <img src="images/tenvolunteer.jpg" alt="Talk" />
    <div class="teach-photo-caption">Named as Top Ten Volenteers (2023)</div>
  </div>
</div>

<!-- # 💻 Internships
- *2019.05 - 2020.02*, [Lorem](https://github.com/), China. -->

# 🏆 Competitions
<div class="paper-box">
  <div class="paper-box-text">
    <p><strong>2024.02</strong>, <a href="https://www.comap.com/contests/mcm-icm">MCM</a>, <em>Outstanding Winner</em> (top &lt;1%)</p>
    <p>
      In the Mathematical Contest in Modeling, my team was awarded the highest distinction, the Outstanding Winner Prize. In this competition, we discussed the momentum shifts in tennis by analyzing match data from the 2023 Wimbledon Championships. The topic is really fascinating for me, since I myself am a tennis lover. I contributed to the use of Exponential Weighted Moving Average (EWMA) to define and detect momentum swings. Here's a view of our <a href="https://www.instagram.com/sjtu_1896/p/C7i6zT4tdG6/?img_index=1" target="_blank">story</a>. Our full paper could be found <a href="https://drive.google.com/file/d/1sfivP-A_PA-UUqpr1lz6x69M1KH5CZxx/view?usp=sharing" target="_blank">here</a>.
    </p>
  </div>
  <div class="paper-box-image">
    <div>
      <div class="badge">MCM Highest Prize</div>
      <img src="images/Oprize.jpg" alt="O" width="100%">
    </div>
  </div>
</div>

<div class="paper-box">
  <div class="paper-box-text">
    <p><strong>2024.02 - 2024.04</strong>, <a href="https://www.chinausyoungmaker.org/">CUYMC</a>, <em>First Prize</em> </p>
    <p>
      In the China-US Young Maker Competition, I designed a digital virtual human to make our intelligent elderly care project more approachable and user-friendly for seniors. By integrating large language models (LLMs) into the Unreal Engine 5 (UE5) platform, I enhanced the system’s interactivity and responsiveness. This work received <a href="https://drive.google.com/file/d/1lClXiM0LWnZ-DQd9cYq3U_eHx9oSAvxb/view?usp=sharing" target="_blank">software copyright</a> recognition in China. Here's a view of our <a href="https://www.instagram.com/p/C9tw3lQss1x/?img_index=1" target="_blank">story</a>.
    </p>
  </div>
  <div class="paper-box-image">
  <div>
    <div class="badge">CUYMC First Prize</div>
    <div class="three-gif-row">
      <img src="images/hantian1.gif" alt="Demo 1" />
      <img src="images/hantian2.gif" alt="Demo 2" />
      <img src="images/hantian3.gif" alt="Demo 3" />
    </div>
  </div>
</div>
</div>

<div class="paper-box">
  <div class="paper-box-text">
    <p><strong>2023.11</strong>, <a href="https://uphysicsc.com/">UPC</a>, <em>Bronze Medal Winner</em> </p>
    <p>
      In the Univeristy Physics Competition, we studied complex dynamic systems, including the problem of multiple people bouncing on an elastic trampoline. In this competition, I worked on simulation-based prediction problems for the first time, leveraging my interdisciplinary background in both mechanical engineering and computer science. Our paper could be found <a href="https://drive.google.com/file/d/1sfivP-A_PA-UUqpr1lz6x69M1KH5CZxx/view?usp=sharing" target="_blank">here</a>.
    </p>
  </div>
  <div class="paper-box-image">
    <div>
      <div class="badge">UPC Bronze Medal</div>
      <img src="images/2023UPC.jpg" alt="O" width="100%">
    </div>
  </div>
</div>

# 🤝 Activities

<div class="paper-box">
  <div class="paper-box-image">
    <div>
      <div class="badge">Desertification Control in Tengger</div>
      <img src="images/green_grid.jpg" alt="Tengger" width="100%">
    </div>
  </div>
  <div class="paper-box-text">
    <p><strong>2024.04 - 2024.05</strong>, <a href="https://en.wikipedia.org/wiki/Tengger_Desert"><strong>Tengger Desert</strong></a>, <strong>Gansu, China</strong>.</p>
    <p>
      Together with more than 40 fellow students from the Green Grid Club at Shanghai Jiao Tong University, we ventured deep into the Tengger Desert in early summer to participate in a social practice project focused on sand prevention and desertification control. Through our joint efforts, our team planted a total of <em>1,000</em> bundles—nearly <em>80,000</em> saplings—of cold-resistant Haloxylon ammodendron, hoping to contribute a patch of green to the ecologically fragile Minqin area.
    </p>
  </div>
</div>

<div class="paper-box">
  <div class="paper-box-text">
    <p><strong>2023.01 - 2023.02</strong>, <a href="https://en.wikipedia.org/wiki/Eryuan_County">Eryuan County</a>, Yunnan, China.</p>
    <p>
      Together with more than twenty other members of the Miyuan Youth Volunteer Team, I traveled to Eryuan in Yunnan Province, where we spent an unforgettable time with local middle school students from several schools. I was responsible for tutoring the children in mathematics, science, and English. Unexpectedly, living, eating, and sharing daily life with the students taught me even more than I was able to teach them, allowing me to grow in ways I hadn’t anticipated.
    </p>
  </div>
  <div class="paper-box-image">
    <div>
      <div class="badge">Conducting a Physics Experiment in Eryuan</div>
      <img src="images/eryuan.jpg" alt="Eryuan" width="100%">
    </div>
  </div>
</div>

<!-- 统一样式 -->
<style>
.paper-box, .paper-box.reverse {
  display: flex;
  align-items: flex-start;
  gap: 36px;
  margin: 32px 0;
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  padding: 32px 28px;
}
.paper-box.reverse { flex-direction: row-reverse; }
.paper-box-image, .paper-box-text {
  flex: 1;
}
.paper-box-image { max-width: 340px; min-width: 180px; }
.paper-box img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(61,90,254,0.04);
}
.paper-box .badge, .paper-box-grid .badge {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #3d5afe;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.paper-box-text p { margin: 0 0 12px 0; font-size: 16px; line-height: 1.7;}
.paper-box-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 28px 36px;
  align-items: start;
  margin: 32px 0;
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  padding: 32px 28px;
}
.paper-box-grid .grid-item { font-size: 16px; line-height: 1.7; }
.paper-box-grid img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(61,90,254,0.05);
}
@media (max-width: 900px) {
  .paper-box, .paper-box.reverse, .paper-box-grid {
    flex-direction: column !important;
    display: block;
    padding: 18px 8px;
  }
  .paper-box-image, .paper-box-text {
    max-width: 100%;
  }
  .paper-box-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 18px 8px;
  }
}

.teach-photos {
  display: flex;
  gap: 15px;
  margin: 26px 0 16px 0;
  justify-content: center;
}
.teach-photo-box {
  flex: 1 1 200px;
  max-width: 260px;
  text-align: center;
}
.teach-photo-box img {
  width: 100%;
  max-width: 260px;
  aspect-ratio: 4/3;   /* 或直接用 height: 180px; */
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(61,90,254,0.08);
  margin-bottom: 10px;
}
.teach-photo-caption {
  font-size: 14px;
  color: #555;
  margin-top: 2px;
  font-style: italic;
  letter-spacing: 0.02em;
}

@media (max-width: 800px) {
  .teach-photos {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
  .teach-photo-box {
    max-width: 92vw;
  }
}

.three-gif-row {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
}
.three-gif-row img {
  width: 120px;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(61,90,254,0.08);
  background: #f5f6fa;
  /* 你可以根据需要改宽高，比如120/120，或者用 max-width: 100px; */
}
@media (max-width: 800px) {
  .three-gif-row {
    flex-direction: row;
    gap: 5px;
  }
  .three-gif-row img {
    width: 28vw;
    height: 28vw;
    max-width: 110px;
    max-height: 110px;
  }
}
</style>