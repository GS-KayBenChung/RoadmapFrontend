using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using YourApp.Models;
using YourApp.Data;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly YourDbContext _context;
    private readonly IConfiguration _config;

    public AuthenticationController(YourDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] string token)
    {
        try
        {
    
            var payload = await GoogleJsonWebSignature.ValidateAsync(token);
            var email = payload.Email;
            var name = payload.Name;
            var googleId = payload.Subject;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

            if (user == null)
            {
           
                user = new User
                {
                    Name = name,
                    Email = email,
                    GoogleId = googleId
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

       
            var jwtToken = GenerateJwtToken(user);

            return Ok(new
            {
                token = jwtToken,
                user = new { user.Id, user.Name, user.Email }
            });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = "Invalid token", error = ex.Message });
        }
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("name", user.Name)
        };

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
