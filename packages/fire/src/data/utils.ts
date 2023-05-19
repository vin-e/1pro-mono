import type { City, County, Service, State } from '@1pro/components';
import { states } from './states';
import { services } from './services';
import data from './';

export const getStates = async (includeCounties = false, includeCities = false): Promise<State[]> => {
  const s = states.map(async (state) => {
    if (includeCounties) {
      const counties = await getCounties(state);
      state.counties = counties;

      if (includeCities) {
        state.counties.forEach(async (county) => {
          const cities = await getCities(state, county);
          county.cities = cities;
        });
      }
    }
    return state;
  });
  const [...allStates] = await Promise.all(s);
  return allStates;
}

export const getCounties = async (state: State): Promise<County[]> => {
  const counties = data[state.abbreviation.toLowerCase()].counties;
  return counties;
}

export const getCities = async (state: State, county: County): Promise<City[]> => {
  const cities = data[state.abbreviation.toLowerCase()].citiesByCounty[county.name.replaceAll(' ', '')];
  return cities;
}

export const getServices = async (state: State, county?: County, city?: City): Promise<Service[]> => {
  const servicesToRender = services
    .filter((service) => {
      if (service.disabled) return false;
      if (state.excludedServices?.includes(service.name)) return false;
      if (county?.excludedServices?.includes(service.name)) return false;
      if (city?.excludedServices?.includes(service.name)) return false;
      return true;
    })
    .map((service) => {
      let url = `${service.url}`;

      // possibly re-look as this for sites other than 1ProFire. Should cities be nested in counties?
      if (city) {
        url = `${city.url}/${service.url}`;
      } else if (county) {
        url = `${county.url}/${service.url}`;
      }
      return {
        ...service,
        rawUrl: service.url,
        url
      }
    });

  return servicesToRender;
}