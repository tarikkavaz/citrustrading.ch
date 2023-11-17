"use client";

import { FC } from 'react';
import { ContentImage } from "@/utils/types";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import {GlobalCarouselProps} from "@/utils/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

export const GlobalCarousel: FC<GlobalCarouselProps> = ({
  images,
  autoplayDelay = 3500,
  loop = true,
  centeredSlides = true,
  paginationClickable = false,
  navigationEnabled = false,
  className = "h-[300px] md:h-[400px] lg:h-[550px] bg-[hsl(var(--foreground))]"
}) => {
  return (
    <Swiper
      loop={loop}
      centeredSlides={centeredSlides}
      autoplay={{
        delay: autoplayDelay,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: paginationClickable,
      }}
      effect={'fade'}
      navigation={navigationEnabled}
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      className={className}
    >
      {images &&
        images.map((image: ContentImage) => (
          <SwiperSlide key={image.id}>
            <picture className="block relative w-full h-full">
              <img src={image.image} className="w-full h-full object-cover object-center border-b-8 border-[hsl(var(--citrus-lemon))]" />
            </picture>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};
