import type { City, County } from '@1pro/components';
import { counties as CaCounties } from './ca/counties';
import { cities as LosAngeles } from './ca/los-angeles-county/cities';
import { cities as Orange } from './ca/orange-county/cities';
import { cities as Riverside } from './ca/riverside-county/cities';
import { cities as SanBernardino } from './ca/san-bernardino-county/cities';
import { cities as SanDiego } from './ca/san-diego-county/cities';

type StateList = {
  counties: County[];
  citiesByCounty: {
    [key: string]: City[];
  }
}

const Lists: { [key: string]: StateList } = {
  ca: {
    counties: CaCounties,
    citiesByCounty: {
      LosAngeles,
      Orange,
      Riverside,
      SanBernardino,
      SanDiego
    }
  }
};

export default Lists;