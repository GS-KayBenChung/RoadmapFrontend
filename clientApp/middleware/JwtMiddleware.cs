using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using YourApp.Data;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _config;

    public JwtMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _config = config;
    }

    public async Task Invoke(HttpContext context, YourDbContext dbContext)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
        {
            try
            {
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true
                }, out var validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value;

                // Attach user to context
                context.Items["User"] = await dbContext.Users.FindAsync(int.Parse(userId));
            }
            catch
            {
                // Do nothing if JWT validation fails
            }
        }

        await _next(context);
    }
}
