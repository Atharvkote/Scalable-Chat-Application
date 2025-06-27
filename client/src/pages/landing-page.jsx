import { MessageCircle, Users, Shield, Zap, Globe, Heart, Star, ArrowRight, Check, Menu } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation */}
      <nav className="bg-base-200 border-b border-base-content/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-base-content">ChatFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-base-content/60 hover:text-base-content transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-base-content/60 hover:text-base-content transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-base-content/60 hover:text-base-content transition-colors">
                Pricing
              </a>
              <button className="px-4 py-2 border border-base-content/20 rounded-lg text-base-content hover:bg-base-content/5 transition-colors">
                Sign In
              </button>
              <button className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <Menu className="h-6 w-6 text-base-content" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <span className="text-sm font-medium">Chat with you friend on चर्चा Verse</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
            Connect, Chat, and
            <span className="text-primary"> Collaborate</span>
          </h1>
          <p className="text-xl text-base-content/60 mb-8 max-w-3xl mx-auto">
            Experience seamless communication with our next-generation chat platform. Built for teams, designed for
            everyone.
          </p>
          <div className="flex flex-col px-10 sm:flex-row gap-4 justify-center mb-12">
            <Link className="w-full md:w-fit" to={'/chat'}>
              <button className="px-6 py-2 bg-primary cursor-pointer w-full text-primary-content rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <button className="px-6 py-2 border cursor-pointer border-base-content/20 text-base-content rounded-lg hover:bg-base-content/5 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="bg-primary/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="bg-base-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-primary/10 text-base-content/60 px-4 py-2 rounded-2xl max-w-xs">
                    Hey team! Ready for today's standup?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-content px-4 py-2 rounded-2xl max-w-xs">
                    Let me share the latest updates.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-primary/10 text-base-content/60 px-4 py-2 rounded-2xl max-w-xs">
                    Perfect! I'll start screen sharing.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Everything you need to communicate
            </h2>
            <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
              Powerful features designed to make your conversations more productive and engaging.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-base-200 border border-base-content/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Real-time Messaging</h3>
              <p className="text-base-content/60">
                Instant messaging with typing indicators, read receipts, and emoji reactions.
              </p>
            </div>

            <div className="bg-base-200 border border-base-content/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Team Collaboration</h3>
              <p className="text-base-content/60">
                Create channels, organize teams, and collaborate seamlessly across projects.
              </p>
            </div>

            <div className="bg-base-200 border border-base-content/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Enterprise Security</h3>
              <p className="text-base-content/60">
                End-to-end encryption, SSO integration, and compliance-ready security features.
              </p>
            </div>

            <div className="bg-base-200 border border-base-content/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Lightning Fast</h3>
              <p className="text-base-content/60">
                Optimized for speed with instant message delivery and minimal latency.
              </p>
            </div>

            <div className="bg-base-200 border border-base-content/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Cross-Platform</h3>
              <p className="text-base-content/60">
                Available on web, mobile, and desktop. Stay connected anywhere, anytime.
              </p>
            </div>

            <div className="bg-base-200 border border-base-content/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">User-Friendly</h3>
              <p className="text-base-content/60">
                Intuitive interface designed for users of all technical backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Get started in minutes</h2>
            <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
              Simple setup process that gets your team chatting in no time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-4">Sign Up</h3>
              <p className="text-base-content/60">Create your account in seconds with email or social login options.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-4">Invite Team</h3>
              <p className="text-base-content/60">
                Add team members and create channels for different projects or topics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-4">Start Chatting</h3>
              <p className="text-base-content/60">
                Begin collaborating with real-time messaging, file sharing, and more.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-6">
            Ready to transform your team communication?
          </h2>
          <p className="text-xl text-base-content/60 mb-8">
            Join thousands of teams already using ChatFlow to collaborate better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="px-6 py-3 border border-base-content/20 text-base-content rounded-lg hover:bg-base-content/5 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-base-content">ChatFlow</span>
              </div>
              <p className="text-base-content/60 mb-4">The next-generation chat platform for modern teams.</p>
            </div>

            <div>
              <h4 className="font-semibold text-base-content mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base-content mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base-content mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-base-content/10 mt-8 pt-8 text-center">
            <p className="text-base-content/60">© 2024 ChatFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
