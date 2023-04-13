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