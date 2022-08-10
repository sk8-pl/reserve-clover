export type PointData = {
    lat: string,
    lon: string,
    alt: number,
    speed: string,
    actions: any[],
}

export type PZObject = {
    name: string,
    points: Array<PointData>
}

export type StructureDataModule = {
    name: string
    flyMissions: Array<PZObject>
}
