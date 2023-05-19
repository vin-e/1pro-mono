export interface BaseEntity {
  name: string
  url: string
  links?: BaseEntity[]
  title?: string
  disabled?: boolean
  excludedServices?: string[]
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
  isFeatured?: boolean
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

export interface Service extends Omit<BaseLocationEntity, 'excludedServices'>{
  showInNav?: boolean
}

export const PAGE_TYPES = {
  STATE: "state",
  COUNTY: "county",
  CITY: "city",
  SERVICE: "service"
};