import React from "react"

interface Props {
  userAddress: string
  // facadeAddress: string
  // setFacadeAddress: string // Currently not needed, since not changeable
}

export default function BasicInfo({ userAddress }: Props) {
  return <section>{userAddress}</section>
}
