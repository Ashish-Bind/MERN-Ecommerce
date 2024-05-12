const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  )
}

export const Skeleton = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  )
}

export default Loader
