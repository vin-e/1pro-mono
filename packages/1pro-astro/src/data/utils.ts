import { states } from './states';

export interface BaseEntity {
  name: string
  url: string
  links?: BaseEntity[]
}

interface GeoCoordinates {
  latitude: number
  longitude: number
}

export interface BaseLocationEntity extends BaseEntity {
  phone?: string
  email?: string
}

export interface City extends  BaseLocationEntity {
  geo?: GeoCoordinates
  areaServed?: string
}
export interface County extends BaseLocationEntity {
  abbreviation: string
  cities?: City[]
  disclaimer?: string
  geo?: GeoCoordinates
  areaServed?: string
}

export interface State extends BaseLocationEntity {
  abbreviation: string
  counties?: County[]
}

export const getStates = async (includeCounties = false, includeCities = false): State[] => {
  const s = states.map(async (state) => {
    if (includeCounties) {
      const counties = await getCounties(state);
      state.counties = counties;

      // TODO - add cities to counties
      // if (includeCities) {
      //   const cities = getCities(state);
      //   state.cities = cities;
      // }
    }
    return state;
  });
  const [...allStates] = await Promise.all(s);
  return allStates;
}

export const getCounties = async (state: State): Promise<County[]> => {
  const { counties } = await import(`./${state.abbreviation.toLowerCase()}/counties.ts`);
  return counties;
}