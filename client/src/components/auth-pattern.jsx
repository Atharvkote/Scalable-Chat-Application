const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center pt-32 justify-center bg-base-200 px-12 pb-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md text-center relative z-10">
        {/* Enhanced grid pattern */}
        <div className="grid grid-cols-3 gap-4 mb-8 perspective-1000">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-primary/20 ${
                i % 3 === 0
                  ? "animate-pulse delay-0"
                  : i % 3 === 1
                    ? "animate-pulse delay-300"
                    : "animate-pulse delay-700"
              }`}
              style={{
                animationDuration: "3s",
                transform: `rotateY(${i * 2}deg) rotateX(${i * 1}deg)`,
              }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-2 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, particleIndex) => (
                  <div
                    key={particleIndex}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full animate-bounce"
                    style={{
                      left: `${20 + particleIndex * 30}%`,
                      top: `${20 + particleIndex * 20}%`,
                      animationDelay: `${particleIndex * 0.5 + i * 0.1}s`,
                      animationDuration: "2s",
                    }}
                  ></div>
                ))}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </div>
          ))}
        </div>

        {/* Enhanced text with subtle animations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text animate-fade-in">
            {title}
          </h2>
          <p className="text-base-content/60 leading-relaxed animate-fade-in delay-200">{subtitle}</p>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export default AuthImagePattern
