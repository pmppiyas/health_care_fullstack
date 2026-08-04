import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
      Health<span className="text-foreground">Care+</span>
    </Link>
  )
}

export default Logo
