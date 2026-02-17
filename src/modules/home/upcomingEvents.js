const upcoming = [
  {
    id: 'u1',
    name: 'Reggae Night',
    place: 'Love Bar',
    performer: 'Various Artists',
    date: '14th Aug 2023',
    time: '9:00PM - 12:00AM',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop',
    description: 'A lively reggae night showcasing both local and touring acts. The event features tropical rhythms, conscious lyrics and danceable grooves. Enjoy drink specials and a relaxed, beachy atmosphere.',
    coordinate: { latitude: 6.9205, longitude: 79.8670 }
  },
  {
    id: 'u2',
    name: 'Indie Sessions',
    place: 'Acoustic Club',
    performer: 'Luna',
    date: '20th Aug 2023',
    time: '7:30PM - 10:00PM',
    image: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=800&h=400&fit=crop',
    description: 'An evening of stripped-down indie performances, highlighting songwriting and raw vocal performances. Perfect for fans who appreciate intimate sets and new discoveries.',
    coordinate: { latitude: 6.9272, longitude: 79.8610 }
  },
  {
    id: 'u3',
    name: 'Electronic Beats',
    place: 'Dance Hall',
    performer: 'Lunatics',
    date: '28th Aug 2023',
    time: '10:00PM - 3:00AM',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    description: 'Cutting-edge electronic music across techno, house and bass. Expect strong production, seamless mixing, and a late-night crowd ready to dance.',
    coordinate: { latitude: 6.9290, longitude: 79.8700 }
  },
  {
    id: 'u4',
    name: 'Late Night Jazz',
    place: 'Blue Note',
    performer: 'Steve Aoki',
    date: '02nd Sep 2023',
    time: '11:00PM - 1:00AM',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop',
    description: 'A sophisticated, late-night jazz session featuring improvisation, complex harmonies and mellow cocktails. Sit back and enjoy a masterful lineup of instrumentalists.',
    coordinate: { latitude: 6.9250, longitude: 79.8550 }
  },
  {
    id: 'u5',
    name: 'Rock Arena',
    place: 'Rock Dome',
    performer: 'Imagine Dragons',
    date: '10th Sep 2023',
    time: '8:00PM - 11:00PM',
    image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800&h=400&fit=crop',
    description: 'A high-impact rock show featuring anthemic choruses and a full stage production. Expect powerful drums, soaring vocals and a crowd that sings along.',
    coordinate: { latitude: 6.9310, longitude: 79.8550 }
  },
  {
    id: 'u6',
    name: 'Pop Fiesta',
    place: 'Pop Club',
    performer: 'Dua Lipa',
    date: '18th Sep 2023',
    time: '9:30PM - 12:30AM',
    image: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=800&h=400&fit=crop',
    description: 'A vibrant pop showcase with tight choreography, infectious hooks and a party-ready environment. Expect confetti moments and singalong hits.',
    coordinate: { latitude: 6.9280, longitude: 79.8650 }
  },
  {
    id: 'u7',
    name: 'Hip Hop Night',
    place: 'Hip Hop Stage',
    performer: 'Drake',
    date: '25th Sep 2023',
    time: '10:00PM - 1:00AM',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=400&fit=crop',
    description: 'Top hip-hop artists take the stage for an energetic evening of beats and bars. Expect surprise guests, freestyles and high production value.',
    coordinate: { latitude: 6.9260, longitude: 79.8590 }
  },
  {
    id: 'u8',
    name: 'Alternative Evening',
    place: 'Alternative Hall',
    performer: 'Coldplay',
    date: '30th Sep 2023',
    time: '7:00PM - 10:00PM',
    image: 'https://images.unsplash.com/photo-1518972559570-0b5d9d3a5f7a?w=800&h=400&fit=crop',
    description: 'A curated lineup of alternative artists blending indie, folk and experimental textures. The night emphasizes atmosphere and thoughtful songwriting.',
    coordinate: { latitude: 6.9300, longitude: 79.8680 }
  },
  {
    id: 'u9',
    name: 'Indie Showcase',
    place: 'Indie Lounge',
    performer: 'Billie Eilish',
    date: '05th Oct 2023',
    time: '6:30PM - 9:00PM',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=400&fit=crop',
    description: 'A carefully selected showcase of emerging indie talent. Expect new voices, delicate arrangements and a listening crowd.',
    coordinate: { latitude: 6.9245, longitude: 79.8625 }
  },
  {
    id: 'u10',
    name: 'Sunset Beats',
    place: 'Beach Stage',
    performer: 'Almaz',
    date: '12th Oct 2023',
    time: '5:00PM - 8:00PM',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&h=400&fit=crop',
    description: 'An open-air sunset session mixing chill electronic grooves with ambient soundscapes — perfect for relaxed evenings by the water.',
    coordinate: { latitude: 6.9140, longitude: 79.8530 }
  },
  {
    id: 'u11',
    name: 'The Weeknd Experience',
    place: 'R&B Venue',
    performer: 'The Weeknd',
    date: '13th Oct 2023',
    time: '9:00PM - 12:00AM',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800&h=400&fit=crop',
    description: 'An immersive concert experience with elaborate staging, lighting, and The Weeknd\'s greatest hits.',
    coordinate: { latitude: 6.9298, longitude: 79.8690 }
  },
  {
    id: 'u12',
    name: 'Ariana Grande Concert',
    place: 'Pop Arena',
    performer: 'Ariana',
    date: '20th Oct 2023',
    time: '8:00PM - 11:00PM',
    image: 'https://images.unsplash.com/photo-1531123414780-f9a3c9f3d9a6?w=800&h=400&fit=crop',
    description: 'A spectacular pop concert featuring Ariana\'s chart-topping hits and a visually stunning production.',
    coordinate: { latitude: 6.9285, longitude: 79.8660 }
  },
  {
    id: 'u13',
    name: 'Chill Vibes',
    place: 'Lounge Bar',
    performer: 'Sade',
    date: '27th Oct 2023',
    time: '6:00PM - 9:00PM',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=400&fit=crop',
    description: 'Smooth tunes and a relaxed atmosphere, perfect for unwinding after a long week.',
    coordinate: { latitude: 6.9270, longitude: 79.8555 }
  },
  {
    id: 'u14',
    name: 'Reggae Revival',
    place: 'Reggae Bar',
    performer: 'Damian Marley',
    date: '03rd Nov 2023',
    time: '9:00PM - 12:00AM',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop',
    description: 'Experience the rebirth of reggae with modern influences and classic roots.',
    coordinate: { latitude: 6.9205, longitude: 79.8670 }
  },
  {
    id: 'u15',
    name: 'Indie Pop Night',
    place: 'Indie Club',
    performer: 'Foster the People',
    date: '10th Nov 2023',
    time: '7:30PM - 10:00PM',
    image: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=800&h=400&fit=crop',
    description: 'A night of catchy melodies and rhythmic grooves from the indie pop spectrum.',
    coordinate: { latitude: 6.9272, longitude: 79.8610 }
  },
  {
    id: 'u16',
    name: 'EDM Wonderland',
    place: 'Main Stage',
    performer: 'Calvin Harris',
    date: '17th Nov 2023',
    time: '10:00PM - 3:00AM',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    description: 'A high-energy EDM festival with top DJs, dazzling lights, and an electric atmosphere.',
    coordinate: { latitude: 6.9290, longitude: 79.8700 }
  },
  {
    id: 'u17',
    name: 'Jazz & Cocktails',
    place: 'Jazz Bar',
    performer: 'Norah Jones',
    date: '24th Nov 2023',
    time: '11:00PM - 1:00AM',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop',
    description: 'Classic jazz standards and original compositions in a cozy, intimate setting.',
    coordinate: { latitude: 6.9250, longitude: 79.8550 }
  },
  {
    id: 'u18',
    name: 'Rock Legends',
    place: 'Rock Arena',
    performer: 'Queen',
    date: '01st Dec 2023',
    time: '8:00PM - 11:00PM',
    image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800&h=400&fit=crop',
    description: 'A tribute to the timeless music of Queen, featuring elaborate costumes and stagecraft.',
    coordinate: { latitude: 6.9310, longitude: 79.8550 }
  },
  {
    id: 'u19',
    name: 'Sunset Groove',
    place: 'Rock Dome',
    performer: 'Coldplay',
    date: '25th Dec 2023',
    time: '5:00PM - 8:00PM',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&h=400&fit=crop',
    description: 'Family-friendly sunset event with a blend of pop and acoustic performances.',
    coordinate: { latitude: 6.9295, longitude: 79.8650 }
  },
  {
    id: 'u20',
    name: 'Late Night R&B',
    place: 'R&B Venue',
    performer: 'The Weeknd',
    date: '3rd Jan 2024',
    time: '9:00PM - 12:00AM',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800&h=400&fit=crop',
    description: 'An intimate late-night R&B show delivering emotional vocals and atmospheric production.',
    coordinate: { latitude: 6.9298, longitude: 79.8690 }
  },
  {
    id: 'u21',
    name: 'Pop Arena Special',
    place: 'Pop Arena',
    performer: 'Ariana',
    date: '15th Jan 2024',
    time: '8:00PM - 11:00PM',
    image: 'https://images.unsplash.com/photo-1531123414780-f9a3c9f3d9a6?w=800&h=400&fit=crop',
    description: 'A headline pop performance with powerful vocals and dynamic staging.',
    coordinate: { latitude: 6.9285, longitude: 79.8660 }
  }
];

export default upcoming;
